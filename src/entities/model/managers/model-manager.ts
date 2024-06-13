import { createEvent, createStore } from 'effector';

import { initAppFolders } from '@/app/lib/initAppFolders.ts';
import { modelsRepository } from '@/db';
import { Model } from '@/db/model';
import { UserSettingsManager, userSettingsManager } from '@/entities/settings';

import { deleteModel } from '../lib/deleteModel.ts';
import { getAvailableModels } from '../lib/getAvailableModels.ts';
import { moveToModelsDir } from '../lib/moveToModelsDir.ts';
import { dropModel, loadModel } from '../model/model-state.ts';

type ModelIdMap = Record<string, Model>;

class ModelManager {
  #models: ModelIdMap = {};

  #isReady = false;

  #currentModel: string | null = null;

  #hasNoModels = false;

  #loadError: string | null = null;

  state = {
    $ready: createStore(false),
    $models: createStore<ModelIdMap>({}),
    $currentModel: createStore<string | null>(null),
    $hasNoModels: createStore(false),
    $loadError: createStore<string | null>(null),
  };

  events = {
    setReady: createEvent<boolean>(),
    setModels: createEvent<ModelIdMap>(),
    setCurrentModels: createEvent<string | null>(),
    setHasNoModels: createEvent<boolean>(),
    setLoadError: createEvent<string | null>(),
  };

  constructor(private readonly userSettings: UserSettingsManager) {
    this.initState();
    initAppFolders().then(() => this.initManager());
  }

  // public API methods

  getModelData(modelId: string) {
    return this.models[modelId]?.data;
  }

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

  // private methods

  private getFirstAvailableModel() {
    return Object.keys(this.models)[0] || null;
  }

  private async initManager() {
    await this.readLocalModels().catch(() => {
      this.loadError = 'Failed to read local models';
    });

    if (this.hasNoModels) return;

    this.currentModel = this.userSettings.get('defaultModel');
    await this.loadCurrentModel().catch(() => {
      this.loadError = 'Failed to load current model';
    });
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

  private initState() {
    this.state.$ready.on(this.events.setReady, (_, val) => val);
    this.state.$models.on(this.events.setModels, (_, models) => models);
    this.state.$currentModel.on(this.events.setCurrentModels, (_, model) => model);
    this.state.$hasNoModels.on(this.events.setHasNoModels, (_, val) => val);
    this.state.$loadError.on(this.events.setLoadError, (_, val) => val);
  }

  // getters/setters

  private get hasNoModels() {
    return this.#hasNoModels;
  }

  private set hasNoModels(val: boolean) {
    this.#hasNoModels = val;
  }

  private get models() {
    return this.#models;
  }

  private set models(models: Record<string, Model>) {
    this.#models = models;
    this.events.setModels(models);
  }

  private get isReady() {
    return this.#isReady;
  }

  private set isReady(val: boolean) {
    this.#isReady = val;
    this.events.setReady(val);
  }

  private get currentModel() {
    return this.#currentModel;
  }

  private set currentModel(val: string | null) {
    this.#currentModel = val;
    this.events.setCurrentModels(val);
  }

  private get loadError() {
    return this.#loadError;
  }

  private set loadError(val: string | null) {
    this.#loadError = val;
    this.events.setLoadError(val);
  }
}

export const modelManager = new ModelManager(userSettingsManager);
