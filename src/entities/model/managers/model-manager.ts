import { createEvent, createStore } from 'effector';

import { modelsRepository } from '@/db';
import { Model } from '@/db/model';
import {
  UserSettingsManager,
  userSettingsManager,
} from '@/entities/model/managers/user-settings-manager.ts';

import { deleteModel } from '../lib/deleteModel.ts';
import { getAvailableModels } from '../lib/getAvailableModels.ts';
import { moveToModelsDir } from '../lib/moveToModelsDir.ts';
import { dropModel, loadModel } from '../model/model-state.ts';

export const $ready = createStore(false);
const setReady = createEvent<boolean>();
$ready.on(setReady, (_, val) => val);

class ModelManager {
  #models: Record<string, Model> = {};

  #isReady = false;

  private currentModel: string | null = null;

  private hasNoModels = false;

  constructor(private readonly userSettings: UserSettingsManager) {
    this.initManager();
  }

  // getters/setters

  get models() {
    return this.#models;
  }

  set models(models: Record<string, Model>) {
    this.#models = models;
  }

  get isReady() {
    return this.#isReady;
  }

  set isReady(val: boolean) {
    this.#isReady = val;
    setReady(val);
  }

  // api methods

  async switchModel(modelId: string) {
    await dropModel();
    const model = this.models[modelId];

    if (!model) {
      throw new Error(`Model with Id "${modelId}" not found`);
    }

    this.currentModel = model.id;

    await this.loadCurrentModel();
  }

  async addModel(modelDto: Model['data'], filePath: string) {
    // move file to models folder

    await moveToModelsDir(filePath, modelDto.localName);

    // save model to the db
    const dbModel = await modelsRepository.create({ data: modelDto, name: modelDto.name });

    // save model to the list
    this.models[dbModel.id] = dbModel;

    // if first model, set as default
    if (this.hasNoModels) {
      console.log('adding first model');

      this.userSettings.set('defaultModel', dbModel.id);
      this.currentModel = dbModel.id;
      this.hasNoModels = false;
      await this.switchModel(dbModel.id);
    }
  }

  async deleteModel(modelId: string) {
    const model = this.models[modelId];

    if (!model) {
      throw new Error(`Model "${modelId}" not found`);
    }

    // remove model from the list
    delete this.models[modelId];

    // remove model from the db
    await modelsRepository.remove(modelId);

    // if the model is the current model, drop it
    if (this.currentModel === modelId) {
      await this.onCurrentModelUnavailable();
    }

    // delete model from the disk
    await deleteModel(model.data.localName);
  }

  get ready() {
    return this.isReady;
  }

  // private methods

  private getFirstAvailableModel() {
    return Object.keys(this.models)[0] || null;
  }

  private async initManager() {
    await this.readLocalModels();
    if (this.hasNoModels) return;

    this.currentModel = this.userSettings.get('defaultModel');
    await this.loadCurrentModel();
  }

  private async loadCurrentModel() {
    if (!this.currentModel) {
      throw new Error('No model selected');
    }

    const model = this.models[this.currentModel];

    if (!model) {
      await this.onCurrentModelUnavailable();
      return;
    }

    const { localName, mmp } = this.models[this.currentModel].data;

    try {
      await loadModel(localName, mmp?.localName);
      this.isReady = true;

      console.info('Model ready!');
    } catch (e) {
      console.error('Failed to load model', e);
    }
  }

  private async onCurrentModelUnavailable() {
    console.log('Current model not available');

    await dropModel();

    // set default/current model to first available
    const newModel = this.getFirstAvailableModel();

    this.currentModel = newModel;
    this.userSettings.set('defaultModel', newModel);

    if (!newModel) {
      this.isReady = false;
      this.hasNoModels = true;
      return;
    }

    await this.switchModel(newModel);
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

    // if has no local models
    if (!models.length) {
      console.log('has no local models');

      this.hasNoModels = true;
      this.userSettings.set('defaultModel', null);
      this.currentModel = null;
      return;
    }

    // update memory list
    this.models = models.reduce<Record<string, Model>>((acc, model) => {
      acc[model.id] = model;
      return acc;
    }, {});
  }
}

export const modelManager = new ModelManager(userSettingsManager);
