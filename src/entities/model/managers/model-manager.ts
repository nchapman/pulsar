import { createEvent, createStore } from 'effector';

import { initAppFolders } from '@/app/lib/initAppFolders.ts';
import { modelFilesRepository, modelsRepository } from '@/db';
import { Model, ModelsRepository } from '@/db/model';
import { ModelFile, ModelFilesRepository, ModelFileType } from '@/db/model-file';
import { ModelDto } from '@/entities/model';
import { UserSettingsManager, userSettingsManager } from '@/entities/settings';
import { promiseAll } from '@/shared/lib/func';
import { loge, logi } from '@/shared/lib/Logger.ts';

import { deleteModel } from '../lib/deleteModel.ts';
import { getAvailableModels } from '../lib/getAvailableModels.ts';
import { getModelPath } from '../lib/getModelPath.ts';
import { moveToModelsDir } from '../lib/moveToModelsDir.ts';
import { NebulaModel } from '../nebula/NebulaModel.ts';

type ModelFileIdMap = Record<Id, ModelFile>;
type ModelFileNameIdMap = Record<string, Id>;
export type Models = Record<string, Model>;

const LOG_TAG = 'Model Manager';

class ModelManager {
  #model: NebulaModel | null = null;

  #modelFiles: ModelFileIdMap = {};

  #models: Models = {};

  #llmNameIdMap: ModelFileNameIdMap = {};

  #mmpNameIdMap: ModelFileNameIdMap = {};

  #isReady = false;

  #currentModel: string | null = null;

  #hasNoModels = false;

  #loadError: string | null = null;

  #appStarted = false;

  state = {
    $ready: createStore(false),
    $models: createStore<Models>({}),
    $modelFiles: createStore<ModelFileIdMap>({}),
    $currentModel: createStore<string | null>(null),
    $hasNoModels: createStore(false),
    $loadError: createStore<string | null>(null),
    $appStarted: createStore(false),
  };

  events = {
    setReady: createEvent<boolean>(),
    setModelFiles: createEvent<ModelFileIdMap>(),
    setModels: createEvent<Models>(),
    setCurrentModels: createEvent<string | null>(),
    setHasNoModels: createEvent<boolean>(),
    setLoadError: createEvent<string | null>(),
    setAppStarted: createEvent<boolean>(),
  };

  constructor(
    private readonly userSettings: UserSettingsManager,
    private readonly modelFilesRepository: ModelFilesRepository,
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
    return this.modelFiles[modelId]?.data;
  }

  async switchModel(modelId: string) {
    const model = this.modelFiles[modelId];

    if (!model) {
      throw new Error(`Model with Id "${modelId}" not found`);
    }

    this.currentModel = model.id;

    await this.loadCurrentModel();
  }

  async addModel(d: {
    dto: ModelFile['data'];
    filePath: string;
    type: ModelFileType;
    modelName: string;
  }) {
    const { dto, filePath, type, modelName } = d;

    // move file to models folder
    await moveToModelsDir(filePath, dto.file.name);

    // save model-file to the db
    const dbModel = await this.modelFilesRepository.create({
      data: dto,
      name: dto.file.name,
      modelName,
      type,
    });

    // save model-file to the list
    this.modelFiles = { ...this.modelFiles, [dbModel.id]: dbModel };
    this.updateModelIdMaps();

    // if first model-file, set as default
    if (this.hasNoModels && type === 'llm') {
      logi(LOG_TAG, 'adding first model-file');

      this.userSettings.set('defaultModel', dbModel.id);
      this.hasNoModels = false;
    }

    return dbModel;
  }

  async deleteModel(modelId: string) {
    const model = this.modelFiles[modelId];

    if (!model) {
      throw new Error(`Model "${modelId}" not found`);
    }

    // remove model-file from the list
    const newModelFiles = { ...this.modelFiles };
    delete newModelFiles[modelId];
    this.modelFiles = newModelFiles;

    // remove model-file from the db
    await this.modelFilesRepository.remove(modelId);

    // if the model-file is the current model-file, drop it
    if (this.currentModel === modelId) {
      await this.loadFirstAvailableModel();
    }

    // delete model-file from the disk
    await deleteModel(model.data.file.name);

    this.updateModelIdMaps();
  }

  async loadFirstAvailableModel() {
    logi(LOG_TAG, 'Loading first available model-file');

    // set default/current model-file to first available
    const newModel = this.getFirstAvailableModel();
    console.log('First available model:', newModel);

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
    const llmIds = Object.values(this.llmNameIdMap);
    return llmIds[0] || null;
  }

  private async initManager() {
    await this.readDBModels();

    await this.readLocalModels().catch(() => {
      this.loadError = 'Failed to read local models';
    });

    if (this.hasNoModels) return;

    this.currentModel = this.userSettings.get('defaultModel') as Id;

    await this.loadCurrentModel().catch(() => {
      this.loadError = 'Failed to load current model-file';
    });
  }

  private async loadCurrentModel() {
    if (!this.currentModel) {
      await this.loadFirstAvailableModel();
      return;
    }

    const modelFile = this.modelFiles[this.currentModel];

    if (!modelFile) {
      await this.loadFirstAvailableModel();
      return;
    }

    if (modelFile.type !== 'llm') {
      throw new Error('Model type not supported');
    }

    const fileName = this.modelFiles[this.currentModel].data.file.name;

    const { mmps } = this.models[modelFile.modelName].data;
    const mmp = mmps.find((mmp) => this.#mmpNameIdMap[mmp]);

    try {
      await this.loadModel(fileName, mmp || undefined);
      this.isReady = true;

      logi(LOG_TAG, 'Model ready!');
    } catch (e) {
      loge(LOG_TAG, `Failed to load model file: ${e}`);
    }
  }

  private async readDBModels() {
    const dbModels = await this.modelsRepository.getAll();
    this.models = dbModels.reduce<Record<string, Model>>((acc, model) => {
      acc[model.name] = model;
      return acc;
    }, {});
  }

  private async readLocalModels() {
    // load models from the disk
    const [availableModels] = await getAvailableModels();

    // get all from db
    let models = await this.modelFilesRepository.getAll();

    // delete missing in local
    await promiseAll(models, async (model) => {
      if (availableModels.includes(model.data.file.name)) return;
      await this.modelFilesRepository.remove(model.id);
    });

    models = await this.modelFilesRepository.getAll();

    // delete missing in db
    await promiseAll(availableModels, async (localName) => {
      if (models.some((model) => model.data.file.name === localName)) return;
      await deleteModel(localName);
    });

    // if has no local models
    if (!models.length) {
      logi(LOG_TAG, 'has no local models');

      this.hasNoModels = true;
      this.userSettings.set('defaultModel', null);
      this.currentModel = null;
      return;
    }

    // update memory list
    this.modelFiles = models.reduce<Record<string, ModelFile>>((acc, model) => {
      acc[model.id] = model;
      return acc;
    }, {});

    // update model-file id maps
    this.updateModelIdMaps();
  }

  private updateModelIdMaps() {
    const llmNameIdMap: ModelFileNameIdMap = {};
    const mmpNameIdMap: ModelFileNameIdMap = {};

    Object.values(this.modelFiles).forEach((model) => {
      if (model.type === 'llm') {
        llmNameIdMap[model.data.file.name] = model.id;
      }

      if (model.type === 'mmp') {
        mmpNameIdMap[model.data.file.name] = model.id;
      }
    });

    this.#llmNameIdMap = llmNameIdMap;
    this.#mmpNameIdMap = mmpNameIdMap;
  }

  private initState() {
    this.state.$ready.on(this.events.setReady, (_, val) => val);
    this.state.$modelFiles.on(this.events.setModelFiles, (_, models) => models);
    this.state.$currentModel.on(this.events.setCurrentModels, (_, model) => model);
    this.state.$hasNoModels.on(this.events.setHasNoModels, (_, val) => val);
    this.state.$loadError.on(this.events.setLoadError, (_, val) => val);
    this.state.$appStarted.on(this.events.setAppStarted, (_, val) => val);
    this.state.$models.on(this.events.setModels, (_, models) => models);
  }

  private async loadModel(llmLocalName: string, mmpLocalName?: string) {
    try {
      await this.dropModel();
      const modelPath = await getModelPath(llmLocalName);
      const multiModalPath = mmpLocalName ? await getModelPath(mmpLocalName) : undefined;

      this.#model = await NebulaModel.initModel(modelPath, multiModalPath, (progress) => {
        logi('Model manager', `Model loading progress: ${progress}`);
      });
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

  async updateOrCreateModel(data: ModelDto) {
    const dbModel = await this.modelsRepository.createOrUpdate(data);
    this.models = { ...this.models, [dbModel.name]: dbModel };
  }

  // getters/setters

  get llmNameIdMap() {
    return this.#llmNameIdMap;
  }

  private get hasNoModels() {
    return this.#hasNoModels;
  }

  private set hasNoModels(val: boolean) {
    this.#hasNoModels = val;
    this.events.setHasNoModels(val);
  }

  private get modelFiles() {
    return this.#modelFiles;
  }

  private set modelFiles(modelFiles: Record<string, ModelFile>) {
    this.#modelFiles = modelFiles;
    this.events.setModelFiles(modelFiles);
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

export const modelManager = new ModelManager(
  userSettingsManager,
  modelFilesRepository,
  modelsRepository
);

export { type ModelManager };
