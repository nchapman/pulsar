import { Model } from '@/db/model/model.repository.ts';

import { modelMock } from './model.mock.ts';

export class ModelsRepositoryMock {
  models: Model[] = modelMock;

  async getById(id: Id): Promise<Model> {
    return Promise.resolve(this.models.find((model) => model.id === id) as Model);
  }

  async getAll(_?: any, __ = false): Promise<Model[]> {
    return Promise.resolve(this.models);
  }

  async create(data: Dto<Model>): Promise<Model> {
    const newModel = {
      ...data,
      id: String(this.models.length + 1),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.models.push(newModel);
    return Promise.resolve(newModel);
  }

  async update(id: Id, data: UpdateDto<Model>): Promise<Model> {
    const model = this.models.find((model) => model.id === id) as Model;
    if (!model) return Promise.resolve(model);

    Object.assign(model, data);
    return Promise.resolve(model);
  }

  async remove(id: Id): Promise<void> {
    this.models = this.models.filter((model) => model.id !== id);
    return Promise.resolve();
  }

  async archiveAll(): Promise<void> {
    this.models = this.models.map((model) => ({ ...model, isArchived: true }));
    return Promise.resolve();
  }

  async removeAll(): Promise<void> {
    this.models = [];
    return Promise.resolve();
  }
}
