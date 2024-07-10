import { Collection, Database } from '@nozbe/watermelondb';

import { ModelFileDto } from '@/entities/model';
import { assignValues, serialize } from '@/shared/lib/func';

import { ModelFileModel } from './model-file.model.ts';
import { modelFilesTable } from './model-file.schema.ts';

export type ModelFileType = 'llm' | 'mmp';

export interface ModelFile {
  id: Id;
  name: string;
  modelName: string;
  data: ModelFileDto;
  type: ModelFileType;
  createdAt: number;
  updatedAt: number;
}

export class ModelFilesRepository {
  modelFilesCollection: Collection<ModelFileModel>;

  constructor(private db: Database) {
    this.modelFilesCollection = this.db.get(modelFilesTable.name);
  }

  async getById(id: Id): Promise<ModelFile> {
    return this.serialize(await this.modelFilesCollection.find(id));
  }

  async getAll(): Promise<ModelFile[]> {
    return this.mapSerialize(await this.modelFilesCollection.query().fetch());
  }

  async create(data: Dto<ModelFile>): Promise<ModelFile> {
    const newModelFile = await this.db.write(() =>
      this.modelFilesCollection.create((post) => assignValues(post, data))
    );

    return this.serialize(newModelFile);
  }

  async update(id: Id, data: UpdateDto<ModelFile>): Promise<ModelFile> {
    const model = await this.modelFilesCollection.find(id);

    try {
      const updatedModelFile = await this.db.write(() =>
        model.update((model) => {
          assignValues(model, data);
        })
      );

      return this.serialize(updatedModelFile);
    } catch (e) {
      return model;
    }
  }

  async remove(id: Id): Promise<void> {
    const model = await this.modelFilesCollection.find(id);
    await this.db.write(() => model.destroyPermanently());
  }

  async removeAll(): Promise<void> {
    await this.db.adapter.unsafeExecute({
      sqls: [[`delete from ${modelFilesTable.name}`, []]],
    });
  }

  private serialize(model: ModelFileModel): ModelFile {
    return serialize(model, ['id', 'name', 'modelName', 'type', 'data', 'createdAt', 'updatedAt']);
  }

  private mapSerialize(models: ModelFileModel[]): ModelFile[] {
    return models.map(this.serialize);
  }
}
