import { ModelFile } from '@/db/model-file/model-file.repository.ts';

import { modelFilesMock } from './model-file.mock.ts';

export class ModelFilesRepositoryMock {
  modelFiles: ModelFile[] = modelFilesMock;

  async getById(id: Id): Promise<ModelFile> {
    return Promise.resolve(this.modelFiles.find((model) => model.id === id) as ModelFile);
  }

  async getAll(_?: any, __ = false): Promise<ModelFile[]> {
    return Promise.resolve(this.modelFiles);
  }

  async create(data: Dto<ModelFile>): Promise<ModelFile> {
    const newModelFile = {
      ...data,
      id: String(this.modelFiles.length + 1),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.modelFiles.push(newModelFile);
    return Promise.resolve(newModelFile);
  }

  async update(id: Id, data: UpdateDto<ModelFile>): Promise<ModelFile> {
    const model = this.modelFiles.find((model) => model.id === id) as ModelFile;
    if (!model) return Promise.resolve(model);

    Object.assign(model, data);
    return Promise.resolve(model);
  }

  async remove(id: Id): Promise<void> {
    this.modelFiles = this.modelFiles.filter((model) => model.id !== id);
    return Promise.resolve();
  }

  async archiveAll(): Promise<void> {
    this.modelFiles = this.modelFiles.map((model) => ({ ...model, isArchived: true }));
    return Promise.resolve();
  }

  async removeAll(): Promise<void> {
    this.modelFiles = [];
    return Promise.resolve();
  }
}
