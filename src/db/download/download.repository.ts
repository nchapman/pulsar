import { Collection, Database } from '@nozbe/watermelondb';

import { ModelFileType } from '@/db/model-file';
import { ModelFileDto } from '@/entities/model';
import { assignValues, serialize } from '@/shared/lib/func';

import { DownloadModel } from './download.model.ts';
import { downloadsTable } from './download.schema.ts';

export interface DownloadItem {
  id: Id;
  remoteUrl: string;
  downloadingData: {
    status: 'queued' | 'downloading' | 'paused' | 'finished';
    downloadId: number;

    progress: number;
    total: number;
    percent: number;

    isFinished: boolean;
    isPaused: boolean;
  };
  type: ModelFileType;
  name: string;
  modelName: string;
  dto: ModelFileDto;

  modelFileId?: Id;

  createdAt: number;
  updatedAt: number;
}

export class DownloadsRepository {
  downloadsCollection: Collection<DownloadModel>;

  constructor(private db: Database) {
    this.downloadsCollection = this.db.get(downloadsTable.name);
  }

  async getById(id: Id): Promise<DownloadItem> {
    return this.serialize(await this.downloadsCollection.find(id));
  }

  async getAll(): Promise<DownloadItem[]> {
    return this.mapSerialize(await this.downloadsCollection.query().fetch());
  }

  async create(data: Dto<DownloadItem>): Promise<DownloadItem> {
    const newModel = await this.db.write(() =>
      this.downloadsCollection.create((d) => assignValues(d, data))
    );

    return this.serialize(newModel);
  }

  async update(id: Id, data: UpdateDto<DownloadItem>): Promise<DownloadItem> {
    console.log('update', id, data.downloadingData?.percent);
    const download = await this.downloadsCollection.find(id);

    try {
      const updatedModel = await this.db.write(() =>
        download.update((download) => {
          assignValues(download, data);
        })
      );

      return this.serialize(updatedModel);
    } catch (e) {
      return download;
    }
  }

  async remove(id: Id): Promise<void> {
    const download = await this.downloadsCollection.find(id);
    await this.db.write(() => download.destroyPermanently());
  }

  async removeAll(): Promise<void> {
    await this.db.adapter.unsafeExecute({
      sqls: [[`delete from ${downloadsTable.name}`, []]],
    });
  }

  private serialize(download: DownloadItem): DownloadItem {
    return serialize(download, [
      'id',
      'downloadingData',
      'remoteUrl',
      'name',
      'modelName',
      'type',
      'dto',
      'modelFileId',
      'createdAt',
      'updatedAt',
    ] as (keyof DownloadItem)[]);
  }

  private mapSerialize(downloads: DownloadModel[]): DownloadItem[] {
    return downloads.map(this.serialize);
  }
}
