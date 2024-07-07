import { Collection, Database, Q } from '@nozbe/watermelondb';

import { ModelDto } from '@/entities/model';
import { assignValues, serialize } from '@/shared/lib/func';

import { ModelModel } from './model.model.ts';
import { modelsTable } from './model.schema.ts';

export interface Model {
  id: Id;
  name: string;
  data: ModelDto;
  createdAt: number;
  updatedAt: number;
}

export class ModelsRepository {
  modelsCollection: Collection<ModelModel>;

  constructor(private db: Database) {
    this.modelsCollection = this.db.get(modelsTable.name);
  }

  async getById(id: Id): Promise<Model> {
    return this.serialize(await this.modelsCollection.find(id));
  }

  async getAll(): Promise<Model[]> {
    return this.mapSerialize(await this.modelsCollection.query().fetch());
  }

  async create(data: Dto<Model>): Promise<Model> {
    const newModel = await this.db.write(() =>
      this.modelsCollection.create((post) => assignValues(post, data))
    );

    return this.serialize(newModel);
  }

  async createOrUpdate(data: ModelDto): Promise<Model> {
    const model = (await this.modelsCollection.query(Q.where('name', Q.eq(data.name))))[0];

    if (model) {
      return this.update(model.id, data);
    }

    return this.create({ name: data.name, data });
  }

  async update(id: Id, data: UpdateDto<Model>): Promise<Model> {
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
      sqls: [[`delete from ${modelsTable.name}`, []]],
    });
  }

  private serialize(model: ModelModel): Model {
    return serialize(model, ['id', 'name', 'data', 'createdAt', 'updatedAt']);
  }

  private mapSerialize(models: ModelModel[]): Model[] {
    return models.map(this.serialize);
  }
}
