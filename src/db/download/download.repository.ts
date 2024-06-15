import { Collection, Database } from '@nozbe/watermelondb';

import { Model, ModelData, ModelType } from '@/db/model';
import { assignValues, serialize } from '@/shared/lib/func';

import { DownloadModel } from './download.model.ts';
import { downloadsTable } from './download.schema.ts';

export interface DownloadItem {
  id: Id;
  remoteUrl: string;

  progress: number;
  isFinished: boolean;
  isPaused: boolean;

  type: ModelType;
  localName: string;

  dto: ModelData;

  model?: Model;

  createdAt: number;
  updatedAt: number;
}

export class DownloadsRepository {
  modelsCollection: Collection<DownloadModel>;

  constructor(private db: Database) {
    this.modelsCollection = this.db.get(downloadsTable.name);
  }

  async getById(id: Id): Promise<DownloadItem> {
    return this.serialize(await this.modelsCollection.find(id));
  }

  async getAll(): Promise<DownloadItem[]> {
    return this.mapSerialize(await this.modelsCollection.query().fetch());
  }

  async create(data: Dto<DownloadItem>): Promise<DownloadItem> {
    const newModel = await this.db.write(() =>
      this.modelsCollection.create((d) => assignValues(d, data))
    );

    return this.serialize(newModel);
  }

  async update(id: Id, data: UpdateDto<DownloadItem>): Promise<DownloadItem> {
    const model = await this.modelsCollection.find(id);

    try {
      const updatedModel = await this.db.write(() =>
        model.update((model) => {
          assignValues(model, data);
        })
      );

      return this.serialize(updatedModel);
    } catch (e) {
      return model;
    }
  }

  async remove(id: Id): Promise<void> {
    const model = await this.modelsCollection.find(id);
    await this.db.write(() => model.destroyPermanently());
  }

  async removeAll(): Promise<void> {
    await this.db.adapter.unsafeExecute({
      sqls: [[`delete from ${downloadsTable.name}`, []]],
    });
  }

  private serialize(model: DownloadModel): DownloadItem {
    return serialize(model, [
      'id',
      'remoteUrl',
      'progress',
      'localName',
      'type',
      'isFinished',
      'isPaused',
      'dto',
      'createdAt',
      'updatedAt',
    ] as (keyof DownloadItem)[]);
  }

  private mapSerialize(models: DownloadModel[]): DownloadItem[] {
    return models.map(this.serialize);
  }
}
