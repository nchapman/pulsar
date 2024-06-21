import { combine, createEffect, createEvent, createStore, sample } from 'effector';

import { fetchHuggingFaceFiles, searchHuggingFaceModels } from '../api/search-hugging-face.ts';
import { HuggingFaceModel, ModelFile } from '../types/hugging-face-model.ts';

const models = createStore<HuggingFaceModel[]>([]);
const currModel = createStore<string | null>(null);
const currModelFiles = createStore<ModelFile[]>([]);
const modelsNameMap = models.map((models) =>
  models.reduce<Record<string, HuggingFaceModel>>(
    (acc, model) => ({ ...acc, [model.name]: model }),
    {}
  )
);

const currModelData = combine(
  {
    currModel,
    modelsNameMap,
  },
  ({ currModel, modelsNameMap }) => (currModel ? modelsNameMap[currModel] : null)
);

export const $modelStoreState = {
  models,
  currModel,
  currModelFiles,
  currModelData,
};

export const modelStoreEvents = {
  searchHF: createEvent<string>(),
  openModelDetails: createEvent<string>(),
  closeModelDetails: createEvent(),
};

const fetchHFModels = createEffect<string, HuggingFaceModel[]>(searchHuggingFaceModels);
const fetchHFFiles = createEffect<string, ModelFile[]>(fetchHuggingFaceFiles);

// fetchHFModels is triggered by searchHF
sample({
  source: modelStoreEvents.searchHF,
  target: fetchHFModels,
});

sample({
  source: $modelStoreState.currModel,
  target: fetchHFFiles,
  fn: (modelId) => modelId!,
  filter: (modelId) => !!modelId,
});

// modelsList is updated by fetchHFModels
$modelStoreState.models.on(fetchHFModels.doneData, (_, data) => data);

// currModel is updated by openModelDetails
$modelStoreState.currModelFiles.on(fetchHFFiles.doneData, (_, data) => data);

$modelStoreState.currModel.on(modelStoreEvents.openModelDetails, (_, modelId) => modelId);
$modelStoreState.currModel.on(modelStoreEvents.closeModelDetails, () => null);
$modelStoreState.currModelFiles.reset(modelStoreEvents.closeModelDetails);
