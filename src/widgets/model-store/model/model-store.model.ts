import { combine, createEffect, createEvent, createStore, sample } from 'effector';

import { goToStore, goToStoreModel } from '@/app/routes';
import { ModelFileData } from '@/entities/model';
import { HuggingFaceModel } from '@/entities/model/types/hugging-face-model.ts';

import { fetchHuggingFaceFiles, searchHuggingFaceModels } from '../api/search-hugging-face.ts';

const models = createStore<HuggingFaceModel[]>([]);
const currModel = createStore<string | null>(null);
const currModelFiles = createStore<ModelFileData[]>([]);
const showCurated = createStore(true);
const searchValue = createStore('');
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
  searchValue,
  showCurated,
  models,
  currModel,
  currModelFiles,
  currModelData,
};

export const modelStoreEvents = {
  setSearchValue: createEvent<string>(),
  searchHF: createEvent(),
  openModelDetails: createEvent<string>(),
  closeModelDetails: createEvent(),
};

export const fetchHFModels = createEffect<string, HuggingFaceModel[]>(searchHuggingFaceModels);
const fetchHFFiles = createEffect<string, ModelFileData[]>(fetchHuggingFaceFiles);

// fetchHFModels is triggered by searchHF
sample({
  source: $modelStoreState.searchValue,
  clock: modelStoreEvents.searchHF,
  target: fetchHFModels,
});

sample({
  source: $modelStoreState.currModel,
  target: fetchHFFiles,
  fn: (modelId) => modelId!,
  filter: (modelId) => !!modelId,
});

$modelStoreState.searchValue.on(modelStoreEvents.setSearchValue, (_, v) => v);

// modelsList is updated by fetchHFModels
$modelStoreState.models.on(fetchHFModels.doneData, (_, data) => data);

$modelStoreState.showCurated.on(fetchHFModels, () => false);

// currModel is updated by openModelDetails
$modelStoreState.currModelFiles.on(fetchHFFiles.doneData, (_, data) => data);

$modelStoreState.currModel.on(modelStoreEvents.openModelDetails, (_, modelId) => modelId);
$modelStoreState.currModel.on(modelStoreEvents.closeModelDetails, () => null);
$modelStoreState.currModelFiles.reset(modelStoreEvents.closeModelDetails);

// goToStore is triggered by openModelDetails
sample({
  clock: modelStoreEvents.openModelDetails,
  target: createEffect(goToStoreModel),
});

// goToStore is triggered by closeModelDetails
sample({
  clock: modelStoreEvents.closeModelDetails,
  target: createEffect(goToStore),
});
$modelStoreState.models.watch(console.log);
$modelStoreState.currModelFiles.watch(console.log);
