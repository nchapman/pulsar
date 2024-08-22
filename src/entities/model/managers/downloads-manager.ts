import { resolve } from '@tauri-apps/api/path';
import { createEvent, createStore } from 'effector';

import { APP_DIRS } from '@/app/consts/app.const.ts';
import { downloadsRepository } from '@/db';
import { DownloadItem, DownloadsRepository } from '@/db/download';
import { ModelDto } from '@/entities/model';
import { UserSettingsManager, userSettingsManager } from '@/entities/settings';
import { download, getRandomInt, interruptFileTransfer } from '@/shared/lib/file-transfer.ts';
import { getPercent, promiseAll } from '@/shared/lib/func';
import { logi } from '@/shared/lib/Logger.ts';

import { deleteDownload } from '../lib/deleteDownload.ts';
import { getAvailableModels } from '../lib/getAvailableModels.ts';
import { getDownloadPath } from '../lib/getDownloadPath.ts';
import { ModelManager, modelManager } from './model-manager.ts';

export type DownloadsData = Record<Id, DownloadItem>;
export type DownloadsNameData = Record<string, DownloadItem>;

class DownloadsManager {
  #downloadsIdsList: Id[] = [];

  #downloadsData: DownloadsData = {};

  #downloadsNameData: DownloadsNameData = {};

  #queue: Id[] = [];

  #current: Id | null = null;

  state = {
    $downloadsIdsList: createStore<Id[]>([]),
    $downloadsData: createStore<DownloadsData>({}),
    $downloadsNameData: createStore<DownloadsNameData>({}),
  };

  events = {
    setDownloadsIdsList: createEvent<Id[]>(),
    setDownloadsData: createEvent<DownloadsData>(),
    setDownloadsNameData: createEvent<DownloadsNameData>(),
  };

  constructor(
    private readonly downloadsRepository: DownloadsRepository,
    private readonly modelManager: ModelManager,
    private readonly userSettings: UserSettingsManager
  ) {
    this.initState();

    this.initManager();
  }

  // public API methods

  async addDownload(
    d: Pick<DownloadItem, 'dto' | 'name' | 'type' | 'remoteUrl' | 'modelName'>,
    modelDto: ModelDto
  ) {
    await this.modelManager.updateOrCreateModel(modelDto);

    const existingDownload = Object.values(this.downloadsData).find(
      (download) => download.name === d.name
    );

    if (this.modelManager.availableLlms.includes(d.name)) {
      console.log('Llm already downloaded, skipping...');
      return undefined;
    }

    if (existingDownload) {
      this.start(existingDownload.id);
      return existingDownload;
    }

    // save download to the db
    const download = await this.downloadsRepository.create({
      ...d,
      downloadingData: {
        downloadId: getRandomInt(),
        progress: 0,
        total: d.dto.file.size,
        percent: 0,
        isFinished: false,
        isPaused: false,
        status: 'queued',
      },
    });

    // save download to the state
    this.downloadsIdsList = [download.id, ...this.#downloadsIdsList];
    this.downloadsData = { ...this.downloadsData, [download.id]: download };

    this.addToQueue(download.id);

    return download;
  }

  async remove(id: Id) {
    if (this.current === id) {
      await this.pause(id);
    }

    const download = this.downloadsData[id];

    if (!download) {
      throw new Error(`Download "${id}" not found`);
    }

    console.log('Deleting model file:', download.modelFileId);

    if (download.modelFileId) {
      await this.modelManager.deleteModel(download.modelFileId);
    }

    // remove download from the db
    await this.downloadsRepository.remove(id);

    // remove download from the state
    this.downloadsIdsList = this.downloadsIdsList.filter((downloadId) => downloadId !== id);

    const newData = { ...this.downloadsData };
    delete newData[id];

    this.downloadsData = newData;

    // delete file from the disk
    await deleteDownload(download.name);

    if (this.current === id) {
      this.downloadNextFromQueue();
    }

    if (this.queue.includes(id)) {
      this.queue = this.queue.filter((queueId) => queueId !== id);
    }
  }

  async start(id: Id) {
    const { remoteUrl: url, name, downloadingData } = this.downloadsData[id];

    const { downloadId, progress, isPaused } = downloadingData;

    if (!isPaused && progress > 0) {
      return;
    }

    const path = await getDownloadPath(name);
    await this.updateDownloadData(id, {
      downloadingData: { ...downloadingData, isPaused: false, status: 'downloading' },
    });

    await download({
      id: downloadId,
      url,
      path,
      progressHandler: (_id, progress, total) => {
        // console.log('progress', progress, total);
        this.updateDownloadProcess(id, progress, total);
      },
    }).catch((e) => logi('download', e));
  }

  async pause(id: Id) {
    const { downloadingData } = this.downloadsData[id];

    await interruptFileTransfer(downloadingData.downloadId);

    await this.updateDownloadData(id, {
      downloadingData: { ...downloadingData, isPaused: true, status: 'paused' },
    });
  }

  // private methods

  private async updateDownloadProcess(id: Id, progress: number, total: number) {
    const download = this.downloadsData[id];

    if (!download) {
      throw new Error(`Download "${id}" not found`);
    }

    const downloadingData = { ...download.downloadingData };

    const isNew = download.downloadingData.progress === 0;

    if (isNew) {
      downloadingData.total = total;
    }

    downloadingData.progress = downloadingData.total - total + progress;
    downloadingData.percent = getPercent(downloadingData.progress, downloadingData.total);

    const dataToUpd: Partial<DownloadItem> = { downloadingData };

    await this.updateDownloadData(id, dataToUpd);

    if (progress === total) {
      this.onItemDownloaded(id);
    }
  }

  private async updateDownloadData(id: Id, data: Partial<DownloadItem>) {
    const download = this.downloadsData[id];

    if (!download) {
      throw new Error(`Download "${id}" not found`);
    }

    this.downloadsData = { ...this.downloadsData, [id]: { ...download, ...data } };
    await this.downloadsRepository.update(id, data);
  }

  private async initManager() {
    this.#queue = (this.userSettings.get('downloadsQueue') as Id[]) || [];
    this.#current = (this.userSettings.get('downloadsCurrent') as Id) || null;

    await this.readLocalDownloads();

    if (!this.current) return;

    // Start download if it was downloading
    const data = this.downloadsData[this.current];

    if (data.downloadingData.status === 'downloading') {
      this.start(this.current);
    }
  }

  private async readLocalDownloads() {
    // load downloads from disk
    const [availableDownloads] = await getAvailableModels(APP_DIRS.DOWNLOADS);

    // get downloads from db
    let downloads = await this.downloadsRepository.getAll();

    // update state
    this.updateStateFromDB(downloads);

    // delete missing in local and unfinished
    await promiseAll(downloads, async (download) => {
      if (
        !availableDownloads.includes(download.name) &&
        !download.downloadingData.isFinished &&
        download.downloadingData.status !== 'queued'
      ) {
        await this.remove(download.id);
      }
    });

    downloads = await this.downloadsRepository.getAll();

    // delete missing in db
    // await promiseAll(availableDownloads, async (localName) => {
    //   if (downloads.some((download) => download.localName === localName)) return;
    //   await deleteDownload(localName);
    // });

    // update state
    this.updateStateFromDB(downloads);

    // pause all downloads
    await promiseAll(downloads, async (download) => {
      if (download.downloadingData.status !== 'downloading') return;
      await this.updateDownloadData(download.id, {
        downloadingData: { ...download.downloadingData, isPaused: true },
      });
    });
  }

  private updateStateFromDB(downloads: DownloadItem[]) {
    this.downloadsIdsList = downloads.map((download) => download.id);
    this.downloadsData = downloads.reduce<Record<Id, DownloadItem>>((acc, download) => {
      acc[download.id] = download;
      return acc;
    }, {});

    this.queue = this.queue.filter((id) => this.downloadsIdsList.includes(id));
    this.current =
      this.current && this.downloadsIdsList.includes(this.current) ? this.current : null;

    if (this.current && !this.downloadsIdsList.includes(this.current)) {
      this.downloadNextFromQueue();
    }
  }

  private async onItemDownloaded(id: Id) {
    const { name, type, dto, modelName } = this.downloadsData[id];

    const filePath = await getDownloadPath(name);

    dto.file.downloadId = id;

    const modelFile = await this.modelManager.addModel({
      type,
      filePath,
      dto,
      modelName,
    });

    // save to the db
    await this.updateDownloadData(id, {
      downloadingData: {
        ...this.downloadsData[id].downloadingData,
        isFinished: true,
        status: 'finished',
      },
      modelFileId: modelFile.id,
    });

    this.downloadNextFromQueue();
  }

  private initState() {
    this.state.$downloadsIdsList.on(this.events.setDownloadsIdsList, (_, val) => val);
    this.state.$downloadsData.on(this.events.setDownloadsData, (_, val) => val);
    this.state.$downloadsNameData.on(this.events.setDownloadsNameData, (_, val) => val);
  }

  private addToQueue(id: Id) {
    if (!this.queue.length && !this.current) {
      this.current = id;
      this.start(id);
      return;
    }

    this.queue = [id, ...this.queue];
  }

  private downloadNextFromQueue() {
    if (!this.queue.length) {
      this.current = null;
      return;
    }

    const newQueue = [...this.queue];
    const nextId = newQueue.pop()!;

    this.queue = newQueue;
    this.current = nextId;

    this.start(nextId);
  }

  async addTestModel() {
    const modelDto: ModelDto = {
      name: 'test-model',
      author: 'test',
      llms: ['evolvedseeker_1_3.Q2_K.gguf'],
      mmps: [],
      task: 'test',
      huggingFaceId: 'none',
    };

    await this.modelManager.updateOrCreateModel(modelDto);

    const modelFileData: Pick<DownloadItem, 'dto' | 'name' | 'type' | 'remoteUrl' | 'modelName'> = {
      name: modelDto.llms[0],
      type: 'llm',
      modelName: modelDto.name,
      remoteUrl: 'none',
      dto: {
        file: {
          name: modelDto.llms[0],
          size: 134,
          isGguf: true,
          isMmproj: false,
          fitsInMemory: true,
        },
      },
    };

    if (this.modelManager.availableLlms.includes(modelFileData.name)) {
      console.log('Llm already downloaded, skipping...');
      return;
    }

    // save download to the db
    const download = await this.downloadsRepository.create({
      ...modelFileData,
      downloadingData: {
        downloadId: getRandomInt(),
        progress: modelFileData.dto.file.size,
        total: modelFileData.dto.file.size,
        percent: 100,
        isFinished: true,
        isPaused: true,
        status: 'finished',
      },
    });

    // save download to the state
    this.downloadsIdsList = [download.id, ...this.#downloadsIdsList];
    this.downloadsData = { ...this.downloadsData, [download.id]: download };

    const { type, dto, modelName, id } = this.downloadsData[download.id];

    const filePath = await resolve('tests', modelFileData.name);

    dto.file.downloadId = id;

    const modelFile = await this.modelManager.addModel({
      type,
      filePath,
      dto,
      modelName,
    });

    // save to the db
    await this.updateDownloadData(id, {
      downloadingData: {
        ...this.downloadsData[id].downloadingData,
        isFinished: true,
        status: 'finished',
      },
      modelFileId: modelFile.id,
    });

    await this.modelManager.switchModel(modelFile.id);
  }

  // getters/setters

  private get queue() {
    return this.#queue;
  }

  private set queue(queue: Id[]) {
    this.#queue = queue;
    this.userSettings.set('downloadsQueue', queue);
  }

  private get current() {
    return this.#current;
  }

  private set current(id: Id | null) {
    this.#current = id;
    this.userSettings.set('downloadsCurrent', id);
  }

  private get downloadsIdsList() {
    return this.#downloadsIdsList;
  }

  private set downloadsIdsList(ids: Id[]) {
    this.#downloadsIdsList = ids;
    this.events.setDownloadsIdsList(ids);
  }

  private get downloadsData() {
    return this.#downloadsData;
  }

  private set downloadsData(data: DownloadsData) {
    this.#downloadsData = data;
    this.#downloadsNameData = Object.values(data).reduce<DownloadsNameData>((acc, download) => {
      acc[download.name] = download;
      return acc;
    }, {});
    this.events.setDownloadsData(data);
    this.events.setDownloadsNameData(this.#downloadsNameData);
  }
}

export const downloadsManager = new DownloadsManager(
  downloadsRepository,
  modelManager,
  userSettingsManager
);
