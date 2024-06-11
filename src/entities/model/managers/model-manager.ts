import { getUserSettings } from '@/app/user-settings';
import { getAvailableModels } from '@/entities/model/lib/getAvailableModels.ts';

import { moveToModelsDir } from '../lib/moveToModelsDir.ts';
import { dropModel, loadModel } from '../model/model-state.ts';

interface Model {
  id: string;
  name: string;
  description: string;
  size: number;
  localName: string;
  mmp?: {
    localName: string;
    size: number;
  };
}

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

  async addModel(modelDto: Omit<Model, 'id'>, filePath: string) {
    // move file to models folder
    await moveToModelsDir(filePath, modelDto.localName);

    // todo: save model to the db
    const model: Model = { id: '1', ...modelDto };

    // save model to the list
    this.models[model.id] = model;
  }

  async deleteModel(modelName: string) {
    if (!this.models[modelName]) {
      throw new Error(`Model "${modelName}" not found`);
    }

    // if the model is the current model, drop it
    if (this.currentModel === modelName) {
      await dropModel();
      this.currentModel = null;
    }

    // todo remove model from the db
    // todo: delete model from the disk

    // todo: remove model from the list
    delete this.models[modelName];
  }

  private async loadCurrentModel() {
    if (!this.currentModel) {
      throw new Error('No model selected');
    }

    const { localName, mmp } = this.models[this.currentModel];

    await loadModel(localName, mmp?.localName);
    this.isReady = true;
  }

  private async readLocalModels() {
    // load models from the disk
    const [availableModels] = await getAvailableModels();

    // get all from db
    // delete missing in local
    // delete missing in db
    // update memory list
    this.models = {};
  }
}
