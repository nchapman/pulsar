import { getUserSettings } from '@/app/user-settings';
import { modelsRepository } from '@/db';
import { Model } from '@/db/model';
import { deleteModel } from '@/entities/model/lib/deleteModel.ts';
import { getAvailableModels } from '@/entities/model/lib/getAvailableModels.ts';

import { moveToModelsDir } from '../lib/moveToModelsDir.ts';
import { dropModel, loadModel } from '../model/model-state.ts';

export class ModelManager {
  private models: Record<string, Model> = {};

  private isReady = false;

  private currentModel: string | null = null;

  constructor() {
    this.readLocalModels();

    this.currentModel = getUserSettings('models').defaultModel;
    this.loadCurrentModel();
  }

  async switchModel(modelName: string) {
    await dropModel();
    const model = this.models[modelName];

    if (!model) {
      throw new Error(`Model "${modelName}" not found`);
    }

    await this.loadCurrentModel();
  }

  async addModel(modelDto: Model['data'], filePath: string) {
    // move file to models folder
    await moveToModelsDir(filePath, modelDto.localName);

    // save model to the db
    const model = await modelsRepository.create({ data: modelDto, name: modelDto.name });

    // save model to the list
    this.models[model.id] = model;
  }

  async deleteModel(modelId: string) {
    if (!this.models[modelId]) {
      throw new Error(`Model "${modelId}" not found`);
    }

    // if the model is the current model, drop it
    if (this.currentModel === modelId) {
      await dropModel();
      this.currentModel = null;
    }

    // remove model from the db
    await modelsRepository.remove(this.models[modelId].id);

    // delete model from the disk
    await deleteModel(this.models[modelId].data.localName);

    // remove model from the list
    delete this.models[modelId];
  }

  private async loadCurrentModel() {
    if (!this.currentModel) {
      throw new Error('No model selected');
    }

    const { localName, mmp } = this.models[this.currentModel].data;

    await loadModel(localName, mmp?.localName);
    this.isReady = true;
  }

  private async readLocalModels() {
    // load models from the disk
    const [availableModels] = await getAvailableModels();

    // get all from db
    let models = await modelsRepository.getAll();

    // delete missing in local
    await Promise.all(
      models.map(async (model) => {
        if (availableModels.includes(model.data.localName)) return;
        await modelsRepository.remove(model.id);
      })
    );

    models = await modelsRepository.getAll();

    // delete missing in db
    await Promise.all(
      availableModels.map(async (localName) => {
        if (models.some((model) => model.data.localName === localName)) return;
        await deleteModel(localName);
      })
    );

    // update memory list
    this.models = models.reduce<Record<string, Model>>((acc, model) => {
      acc[model.id] = model;
      return acc;
    }, {});
  }
}
