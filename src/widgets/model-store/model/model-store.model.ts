import { ModelEntry } from '@huggingface/hub';
import { createEffect, createEvent, createStore, sample } from 'effector';

import { fetchHuggingFaceFiles, searchHuggingFaceModels } from '../api/search-hugging-face.ts';
import { ModelFile } from '../types/hugging-face-model.ts';

export const $modelStoreState = {
  models: createStore<ModelEntry[]>([]),
  currModel: createStore<string | null>(null),
  currModelFiles: createStore<ModelFile[]>([]),
};

export const modelStoreEvents = {
  searchHF: createEvent<string>(),
  openModelDetails: createEvent<string>(),
  closeModelDetails: createEvent(),
};

const fetchHFModels = createEffect<string, ModelEntry[]>(searchHuggingFaceModels);
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
