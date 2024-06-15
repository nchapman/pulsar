import { createEvent, createStore } from 'effector';

import { initAppFolders } from '@/app/lib/initAppFolders.ts';
import { modelsRepository } from '@/db';
import { Model, ModelsRepository, ModelType } from '@/db/model';
import { UserSettingsManager, userSettingsManager } from '@/entities/settings';
import { loge, logi } from '@/shared/lib/Logger.ts';

import { deleteModel } from '../lib/deleteModel.ts';
import { getAvailableModels } from '../lib/getAvailableModels.ts';
import { getModelPath } from '../lib/getModelPath.ts';
import { moveToModelsDir } from '../lib/moveToModelsDir.ts';
import { NebulaModel } from '../nebula/NebulaModel.ts';

type ModelIdMap = Record<Id, Model>;
type ModelNameIdMap = Record<string, Id>;

const LOG_TAG = 'Model Manager';

class ModelManager {
  #model: NebulaModel | null = null;

  #models: ModelIdMap = {};

  #llmNameIdMap: ModelNameIdMap = {};

  #mmpNameIdMap: ModelNameIdMap = {};

  #isReady = false;

  #currentModel: string | null = null;

  #hasNoModels = false;

  #loadError: string | null = null;

  #appStarted = false;

  state = {
    $ready: createStore(false),
    $models: createStore<ModelIdMap>({}),
    $currentModel: createStore<string | null>(null),
    $hasNoModels: createStore(false),
    $loadError: createStore<string | null>(null),
    $appStarted: createStore(false),
  };

  events = {
    setReady: createEvent<boolean>(),
    setModels: createEvent<ModelIdMap>(),
    setCurrentModels: createEvent<string | null>(),
    setHasNoModels: createEvent<boolean>(),
    setLoadError: createEvent<string | null>(),
    setAppStarted: createEvent<boolean>(),
  };

  constructor(
    private readonly userSettings: UserSettingsManager,
    private readonly modelsRepository: ModelsRepository
  ) {
    this.initState();

    (async () => {
      await initAppFolders();
      await this.initManager();
      this.appStarted = true;
    })();
  }

  // public API methods

  getModelData(modelId: string) {
    return this.models[modelId]?.data;
  }

  async switchModel(modelId: string) {
    const model = this.models[modelId];

    if (!model) {
      throw new Error(`Model with Id "${modelId}" not found`);
    }

    this.currentModel = model.id;

    await this.loadCurrentModel();
  }

  async addModel(d: { modelDto: Model['data']; filePath: string; type: ModelType }) {
    const { modelDto, filePath, type } = d;

    if (type === 'mmp' && !modelDto.llmName) {
      throw new Error('LLM model name is required for MMP model');
    }

    // move file to models folder
    await moveToModelsDir(filePath, modelDto.localName);

    // save model to the db
    const dbModel = await this.modelsRepository.create({
      data: modelDto,
      name: modelDto.name,
      type,
    });

    // save model to the list
    this.models[dbModel.id] = dbModel;

    // if first model, set as default
    if (this.hasNoModels) {
      logi(LOG_TAG, 'adding first model');

      this.userSettings.set('defaultModel', dbModel.id);
      this.hasNoModels = false;
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
    await this.modelsRepository.remove(modelId);

    // if the model is the current model, drop it
    if (this.currentModel === modelId) {
      await this.loadFirstAvailableModel();
    }

    // delete model from the disk
    await deleteModel(model.data.localName);
  }

  async loadFirstAvailableModel() {
    logi(LOG_TAG, 'Loading first available model');

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
      await this.loadFirstAvailableModel();
      return;
    }

    const model = this.models[this.currentModel];

    if (!model) {
      await this.loadFirstAvailableModel();
      return;
    }

    if (model.type !== 'llm') {
      throw new Error('Model type not supported');
    }

    const { localName, mmpName } = this.models[this.currentModel].data;

    const isMmpPresent = mmpName && this.#mmpNameIdMap[mmpName];

    try {
      await this.loadModel(localName, isMmpPresent ? mmpName : undefined);
      this.isReady = true;

      logi(LOG_TAG, 'Model ready!');
    } catch (e) {
      loge(LOG_TAG, `Failed to load model: ${e}`);
    }
  }

  private async readLocalModels() {
    // load models from the disk
    const [availableModels] = await getAvailableModels();

    // get all from db
    let models = await this.modelsRepository.getAll();

    // delete missing in local
    await Promise.all(
      models.map(async (model) => {
        if (availableModels.includes(model.data.localName)) return;
        await this.modelsRepository.remove(model.id);
      })
    );

    models = await this.modelsRepository.getAll();

    // delete missing in db
    await Promise.all(
      availableModels.map(async (localName) => {
        if (models.some((model) => model.data.localName === localName)) return;
        await deleteModel(localName);
      })
    );

    // if has no local models
    if (!models.length) {
      logi(LOG_TAG, 'has no local models');

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

    // update model id maps
    this.updateModelIdMaps();
  }

  private updateModelIdMaps() {
    const llmNameIdMap: ModelNameIdMap = {};
    const mmpNameIdMap: ModelNameIdMap = {};

    Object.values(this.models).forEach((model) => {
      if (model.type === 'llm') {
        llmNameIdMap[model.data.localName] = model.id;
      }

      if (model.type === 'mmp') {
        mmpNameIdMap[model.data.localName] = model.id;
      }
    });

    this.#llmNameIdMap = llmNameIdMap;
    this.#mmpNameIdMap = mmpNameIdMap;
  }

  private initState() {
    this.state.$ready.on(this.events.setReady, (_, val) => val);
    this.state.$models.on(this.events.setModels, (_, models) => models);
    this.state.$currentModel.on(this.events.setCurrentModels, (_, model) => model);
    this.state.$hasNoModels.on(this.events.setHasNoModels, (_, val) => val);
    this.state.$loadError.on(this.events.setLoadError, (_, val) => val);
    this.state.$appStarted.on(this.events.setAppStarted, (_, val) => val);
  }

  private async loadModel(llmLocalName: string, mmpLocalName?: string) {
    try {
      await this.dropModel();
      const modelPath = await getModelPath(llmLocalName);
      const multiModalPath = mmpLocalName ? await getModelPath(mmpLocalName) : undefined;

      this.#model = await NebulaModel.initModel(modelPath, multiModalPath);
    } catch (e) {
      loge('Model manager', `Failed to load model, rust error: ${e}`);
      throw e;
    }
  }

  private async dropModel() {
    try {
      this.#model?.drop();
      this.#model = null;
    } catch (e: any) {
      loge('Model manager', `Failed to unload model ${e}`);
      throw e;
    }
  }

  // getters/setters

  private get hasNoModels() {
    return this.#hasNoModels;
  }

  private set hasNoModels(val: boolean) {
    this.#hasNoModels = val;
    this.events.setHasNoModels(val);
  }

  private get models() {
    return this.#models;
  }

  private set models(models: Record<string, Model>) {
    this.#models = models;
    this.events.setModels(models);
  }

  get isReady() {
    return this.#isReady;
  }

  private set isReady(val: boolean) {
    this.#isReady = val;
    this.events.setReady(val);
  }

  get model() {
    return this.#model;
  }

  get availableLlms() {
    return Object.keys(this.#llmNameIdMap);
  }

  get appStarted() {
    return this.#appStarted;
  }

  set appStarted(val: boolean) {
    this.#appStarted = val;
    this.events.setAppStarted(val);
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

export const modelManager = new ModelManager(userSettingsManager, modelsRepository);
