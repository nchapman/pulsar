import { combine, createEffect, createEvent, createStore, sample } from 'effector';

import { $currRoute, goToStore, goToStoreModel, goToStoreSearch, Route } from '@/app/routes';
import { curatedModels as curated, ModelFileData } from '@/entities/model';
import { CuratedModel, HuggingFaceModel } from '@/entities/model/types/hugging-face-model.ts';
import { getModelFileInfo } from '@/widgets/model-store/lib/getModelFileInfo.ts';
import { ModelSorting } from '@/widgets/model-store/types/model-sorting.ts';

import { fetchHuggingFaceFiles, searchHuggingFaceModels } from '../api/search-hugging-face.ts';

const modelSortingAll = createStore<ModelSorting>(ModelSorting.MOST_DOWNLOADS);
const modelSortingSearch = createStore<ModelSorting>(ModelSorting.MOST_DOWNLOADS);

const models = createStore<HuggingFaceModel[]>([]);
const currModel = createStore<string | null>(null);
const modelFiles = createStore<Record<string, ModelFileData[]>>({});
const currModelFiles = combine(
  modelFiles,
  currModel,
  (files, currModel) => (currModel && files[currModel] ? files[currModel] : []),
  { skipVoid: false }
);
const searchValue = createStore('');

const listScroll = createStore(0);
const setListScroll = createEvent<number>();
listScroll.on(setListScroll, (_, v) => v);

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

const setModelSortingAll = createEvent<ModelSorting>();
const setModelSortingSearch = createEvent<ModelSorting>();

modelSortingAll.on(setModelSortingAll, (_, v) => v);
modelSortingSearch.on(setModelSortingSearch, (_, v) => v);

export const $modelStoreState = {
  searchValue,
  models,
  currModel,
  modelFiles,
  currModelData,
  curatedModels,
  modelSortingAll,
  setModelSortingAll,
  modelSortingSearch,
  setModelSortingSearch,
  currModelFiles,
  listScroll,
};

export const modelStoreEvents = {
  setSearchValue: createEvent<string>(),
  searchHF: createEvent(),
  openModelDetails: createEvent<string>(),
  closeModelDetails: createEvent(),
  setListScroll,
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
  searchHuggingFaceModels({
    query,
    sorting:
      $currRoute.getState() === Route.Store
        ? modelSortingAll.getState()
        : modelSortingSearch.getState(),
    modelsOnly: !query,
  })
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
  clock: $modelStoreState.modelSortingAll,
  target: fetchHFModels,
});

sample({
  source: $modelStoreState.searchValue,
  clock: $modelStoreState.modelSortingSearch,
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
  source: $modelStoreState.searchValue,
  clock: modelStoreEvents.closeModelDetails,
  fn: (value) => value,
  target: createEffect((value: string) => {
    if (value) {
      goToStoreSearch();
    } else {
      goToStore();
    }
  }),
});
