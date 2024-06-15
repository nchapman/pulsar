import { APP_DIRS } from '@/app/consts/app.const.ts';
import { downloadsRepository } from '@/db';
import { DownloadItem, DownloadsRepository } from '@/db/download';

import { deleteDownload } from '../lib/deleteDownload.ts';
import { getAvailableModels } from '../lib/getAvailableModels.ts';

class DownloadsManager {
  #downloadsIdsList: Id[] = [];

  #downloadsData: Record<Id, DownloadItem> = {};

  constructor(private readonly downloadsRepository: DownloadsRepository) {
    this.initState();

    this.initManager();
  }

  // public API methods

  async addDownload(d: Pick<DownloadItem, 'dto' | 'localName' | 'type' | 'remoteUrl'>) {
    // save download to the db
    const download = await this.downloadsRepository.create({
      ...d,
      progress: 0,
      isFinished: false,
      isPaused: false,
    });

    // save download to the state
    this.downloadsIdsList = [download.id, ...this.#downloadsIdsList];
    this.downloadsData[download.id] = download;

    this.start(download.id);
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

  start(id: Id) {}

  pause(id: Id) {}

  // private methods

  private updateDownloadData(id: Id, data: Partial<DownloadItem>) {}

  private async initManager() {
    await this.readLocalDownloads();
  }

  private async readLocalDownloads() {
    // load downloads from disk
    const [availableModels] = await getAvailableModels(APP_DIRS.DOWNLOADS);

    // get downloads from db
  }

  private onItemDownloaded() {
    // todo: move to the models folder
    // todo: save to the db, isFinished = true, modelId = Id
  }

  private initState() {}

  // getters/setters

  private get downloadsIdsList() {
    return this.#downloadsIdsList;
  }

  private set downloadsIdsList(ids: Id[]) {
    this.#downloadsIdsList = ids;
  }

  private get downloadsData() {
    return this.#downloadsData;
  }

  private set downloadsData(data: Record<Id, DownloadItem>) {
    this.#downloadsData = data;
  }
}

export const downloadsManager = new DownloadsManager(downloadsRepository);
