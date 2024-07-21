import { combine, createEffect, createEvent, createStore, sample } from 'effector';

import { goToStore, goToStoreModel } from '@/app/routes';
import { curatedModels as curated, ModelFileData } from '@/entities/model';
import { CuratedModel, HuggingFaceModel } from '@/entities/model/types/hugging-face-model.ts';
import { getModelFileInfo } from '@/widgets/model-store/lib/getModelFileInfo.ts';
import { ModelSorting } from '@/widgets/model-store/types/model-sorting.ts';

import { fetchHuggingFaceFiles, searchHuggingFaceModels } from '../api/search-hugging-face.ts';

const modelSorting = createStore<ModelSorting>(ModelSorting.MOST_DOWNLOADS);
const models = createStore<HuggingFaceModel[]>([]);
const currModel = createStore<string | null>(null);
const modelFiles = createStore<Record<string, ModelFileData[]>>({});
const currModelFiles = combine(modelFiles, currModel, (files, currModel) =>
  currModel ? files[currModel] : []
);
const showCurated = createStore(true);
const searchValue = createStore('');
const modelsNameMap = models.map((models) =>
  models.reduce<Record<string, HuggingFaceModel>>(
    (acc, model) => ({ ...acc, [model.name]: model }),
    {}
  )
);

const curatedModels = createStore<CuratedModel[]>([]);

const currModelData = combine(
  {
    currModel,
    modelsNameMap,
    curatedModels,
  },
  ({ currModel, modelsNameMap, curatedModels }) =>
    currModel ? modelsNameMap[currModel] || curatedModels.find((i) => i.name === currModel) : null
);

const setModelSorting = createEvent<ModelSorting>();
modelSorting.on(setModelSorting, (_, v) => v);

export const $modelStoreState = {
  searchValue,
  showCurated,
  models,
  currModel,
  modelFiles,
  currModelData,
  curatedModels,
  modelSorting,
  setModelSorting,
  currModelFiles,
};

export const modelStoreEvents = {
  setSearchValue: createEvent<string>(),
  searchHF: createEvent(),
  openModelDetails: createEvent<string>(),
  closeModelDetails: createEvent(),
};

const fetchCuratedModels = createEffect(() =>
  Promise.all(
    curated.map(async (i) => {
      const { modelData } = await getModelFileInfo(i.modelName, i.fileName);
      return { ...modelData, description: i.description, logo: i.logo };
    })
  )
);

$modelStoreState.curatedModels.on(fetchCuratedModels.doneData, (_, data) => data);
fetchCuratedModels();

export const fetchHFModels = createEffect<string, HuggingFaceModel[]>((query: string) =>
  searchHuggingFaceModels(query, modelSorting.getState())
);

const fetchHFFiles = createEffect<string, { files: ModelFileData[]; modelId: string }>(
  async (modelId: string) => {
    const files = await fetchHuggingFaceFiles(modelId);
    return { files, modelId };
  }
);

// fetchHFModels is triggered by searchHF
sample({
  source: $modelStoreState.searchValue,
  clock: modelStoreEvents.searchHF,
  target: fetchHFModels,
});

// fetchHFModels is triggered by searchHF
sample({
  source: $modelStoreState.searchValue,
  clock: $modelStoreState.modelSorting,
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

fetchHFModels('');

$modelStoreState.showCurated.on(fetchHFModels, () => false);

// currModel is updated by openModelDetails
$modelStoreState.modelFiles.on(fetchHFFiles.doneData, (prev, { files, modelId }) => ({
  ...prev,
  [modelId]: files,
}));

$modelStoreState.currModel.on(modelStoreEvents.openModelDetails, (_, modelId) => modelId);
$modelStoreState.currModel.on(modelStoreEvents.closeModelDetails, () => null);

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
