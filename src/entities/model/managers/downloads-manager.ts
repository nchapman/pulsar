import { createEvent, createStore } from 'effector';

import { APP_DIRS } from '@/app/consts/app.const.ts';
import { downloadsRepository } from '@/db';
import { DownloadItem, DownloadsRepository } from '@/db/download';
import { download, getRandomInt, interruptFileTransfer } from '@/shared/lib/file-transfer.ts';
import { getPercent, promiseAll } from '@/shared/lib/func';
import { logi } from '@/shared/lib/Logger.ts';

import { deleteDownload } from '../lib/deleteDownload.ts';
import { getAvailableModels } from '../lib/getAvailableModels.ts';
import { getDownloadPath } from '../lib/getDownloadPath.ts';
import { ModelManager, modelManager } from './model-manager.ts';

export type DownloadsData = Record<Id, DownloadItem>;

class DownloadsManager {
  #downloadsIdsList: Id[] = [];

  #downloadsData: DownloadsData = {};

  state = {
    $downloadsIdsList: createStore<Id[]>([]),
    $downloadsData: createStore<DownloadsData>({}),
  };

  events = {
    setDownloadsIdsList: createEvent<Id[]>(),
    setDownloadsData: createEvent<DownloadsData>(),
  };

  constructor(
    private readonly downloadsRepository: DownloadsRepository,
    private readonly modelManager: ModelManager
  ) {
    this.initState();

    this.initManager();
  }

  // public API methods

  async addDownload(d: Pick<DownloadItem, 'dto' | 'localName' | 'type' | 'remoteUrl'>) {
    const existingDownload = Object.values(this.downloadsData).find(
      (download) => download.localName === d.localName
    );

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
        total: 0,
        percent: 0,
        isFinished: false,
        isPaused: false,
      },
    });

    // save download to the state
    this.downloadsIdsList = [download.id, ...this.#downloadsIdsList];
    this.downloadsData[download.id] = download;

    this.start(download.id);

    return download;
  }

  async remove(id: Id) {
    const download = this.downloadsData[id];

    if (!download) {
      throw new Error(`Download "${id}" not found`);
    }

    // remove download from the db
    await this.downloadsRepository.remove(id);

    // remove download from the state
    this.downloadsIdsList = this.downloadsIdsList.filter((downloadId) => downloadId !== id);
    delete this.downloadsData[id];

    // delete file from the disk
    await deleteDownload(download.localName);
  }

  async start(id: Id) {
    const { remoteUrl: url, localName, downloadingData } = this.downloadsData[id];

    const { downloadId, progress, isPaused } = downloadingData;

    if (!isPaused && progress > 0) {
      return;
    }

    const path = await getDownloadPath(localName);
    await this.updateDownloadData(id, { downloadingData: { ...downloadingData, isPaused: false } });

    await download({
      id: downloadId,
      url,
      path,
      progressHandler: (_id, progress, total) => {
        console.log('progress', progress, total);
        this.updateDownloadProcess(id, progress, total);
      },
    }).catch((e) => logi('download', e));
  }

  async pause(id: Id) {
    const { downloadingData } = this.downloadsData[id];

    await interruptFileTransfer(downloadingData.downloadId);

    await this.updateDownloadData(id, { downloadingData: { ...downloadingData, isPaused: true } });
  }

  // private methods

  private async updateDownloadProcess(id: Id, progress: number, total: number) {
    const download = this.downloadsData[id];

    if (!download) {
      throw new Error(`Download "${id}" not found`);
    }

    const isNew = download.downloadingData.progress === 0;

    const newData = { ...download };

    if (isNew) {
      newData.downloadingData.total = total;
      newData.dto.file.size = total;
    }

    newData.downloadingData.progress = newData.downloadingData.total - total + progress;
    newData.downloadingData.percent = getPercent(
      newData.downloadingData.progress,
      newData.downloadingData.total
    );

    await this.downloadsRepository.update(id, newData);

    this.downloadsData = {
      ...this.downloadsData,
      [id]: newData,
    };

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
    await this.readLocalDownloads();
  }

  private async readLocalDownloads() {
    // load downloads from disk
    const [availableDownloads] = await getAvailableModels(APP_DIRS.DOWNLOADS);

    // get downloads from db
    let downloads = await this.downloadsRepository.getAll();

    // delete missing in local and unfinished
    await promiseAll(downloads, async (download) => {
      if (
        !availableDownloads.includes(download.localName) &&
        !download.downloadingData.isFinished
      ) {
        await this.downloadsRepository.remove(download.id);
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
      if (download.downloadingData.isPaused) return;
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
  }

  private async onItemDownloaded(id: Id) {
    const {
      localName,
      type,
      dto: { model: modelDto },
    } = this.downloadsData[id];

    const filePath = await getDownloadPath(localName);

    const model = await this.modelManager.addModel({
      type,
      filePath,
      modelDto,
    });

    // save to the db
    await this.updateDownloadData(id, {
      downloadingData: { ...this.downloadsData[id].downloadingData, isFinished: true },
      modelId: model.id,
    });
  }

  private initState() {
    this.state.$downloadsIdsList.on(this.events.setDownloadsIdsList, (_, val) => val);
    this.state.$downloadsData.on(this.events.setDownloadsData, (_, val) => val);
  }

  // getters/setters

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

  private set downloadsData(data: Record<Id, DownloadItem>) {
    this.#downloadsData = data;
    this.events.setDownloadsData(data);
  }
}

export const downloadsManager = new DownloadsManager(downloadsRepository, modelManager);
