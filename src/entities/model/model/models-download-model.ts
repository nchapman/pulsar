import { combine, createEffect, createEvent, createStore, sample } from 'effector';
import { download } from 'tauri-plugin-upload-api';

import { downloadModel } from '@/entities/model';
import { getModelPath } from '@/entities/model/lib/getModelPath.ts';

import { DEFAULT_LLM } from '../consts/model.const.ts';
import { LlmName, supportedLlms } from '../consts/supported-llms.const.ts';
import { getAvailableModels } from '../lib/getAvailableModels.ts';
import { dropModel, loadModel } from './model-state.ts';

// check available models
// if current not available - show download screen
// if available - check mmp
// download current on event trigger (download btn click)
// when downloaded, check mmp
// if has mmp = download it
// set ready to true
// load model on true

// P.S
// treat llm and mmp as equal when downloading

const $availableModels = createStore<Record<string, boolean> | null>(null);
const getAvailableModelsEff = createEffect(getAvailableModels);

$availableModels.on(getAvailableModelsEff.doneData, (_, availableModels) => availableModels);

// download info / false on downloaded
type ModelDownloadInfo = { percent: number; isMmp: boolean } | false;

const $modelsDownload = createStore<Record<string, ModelDownloadInfo>>({});
const updateDownloadInfo = createEvent<{ model: string; info: ModelDownloadInfo }>();

$modelsDownload.on(updateDownloadInfo, (store, { info, model }) => ({ ...store, [model]: info }));

// mark downloaded model as available
sample({
  source: $availableModels,
  clock: updateDownloadInfo,
  filter: (_, { info }) => !info,
  fn: (availableModels, { model }) => ({ ...availableModels, [model]: true }),
  target: $availableModels,
});

const downloadModelEff = createEffect((model: LlmName) => {
  downloadModel('', '', (percent) => updateDownloadInfo({ model, info: { percent } }));
});

const $currentModel = createStore<LlmName>(DEFAULT_LLM);
const $currentMmp = $currentModel.map((currentModel) => supportedLlms[currentModel].mmp?.localName);
const $hasMmp = $currentMmp.map((currentMmp) => !!currentMmp);

export const $modelReady = createStore(false);
const setModelReady = createEvent<boolean>();

const $llmPresent = combine(
  $availableModels,
  $currentModel,
  (available, current) => !!available?.[current]
);

const $mmpPresent = combine($availableModels, $currentMmp, (available, currentMmp) =>
  currentMmp && available ? available[currentMmp] : false
);

const $modelPresent = combine(
  $hasMmp,
  $llmPresent,
  $mmpPresent,
  (hasMmp, llmPresent, mmpPresent) => {
    if (!hasMmp) return llmPresent;
    return llmPresent && mmpPresent;
  }
);

const loadModelEff = createEffect<{ llm: LlmName }, void>(({ llm }) => {
  dropModel()
    .then(() => loadModel(llm))
    .then(() => setModelReady(true))
    .catch(() => setModelReady(false));
});

// load model on model present
sample({
  source: $currentModel,
  clock: $modelPresent,
  filter: (_, present) => present,
  fn: (llm) => ({ llm }),
  target: loadModelEff,
});
