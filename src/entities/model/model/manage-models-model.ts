import { combine, createEffect, createEvent, createStore, sample } from 'effector';

import { restoreWindowSize } from '@/pages/onboarding/lib/window-size.ts';

import { downloadModel } from '../api/downloadModel';
import { DEFAULT_LLM } from '../consts/model.const';
import { LlmName, supportedLlms } from '../consts/supported-llms.const';
import { calcPercent } from '../lib/calcPercent.ts';
import { getAvailableModels } from '../lib/getAvailableModels';
import { ModelDownloadInfo } from '../types/model.types.ts';
import { dropModel, loadModel } from './model-state';

// export const $appStatus = createStore<AppStatus>('loading');

const $availableModels = createStore<Record<string, boolean> | null>(null);
export const getAvailableModelsEff = createEffect(getAvailableModels);

$availableModels.on(getAvailableModelsEff.doneData, (_, [, availableModels]) => availableModels);

export const $modelsDownload = createStore<OptionalRecord<LlmName, ModelDownloadInfo>>({});
const updateDownloadInfo = createEvent<{ model: LlmName; info: ModelDownloadInfo }>();

$modelsDownload.on(updateDownloadInfo, (store, { info, model }) => {
  const newState = { ...store, [model]: { ...(store[model] || {}), ...info } };

  newState[model]!.percent = calcPercent(newState[model]!);

  return newState;
});

// mark downloaded model as available
sample({
  source: $availableModels,
  clock: updateDownloadInfo,
  filter: (_, { info }) => info.percentLlm === 100 || info.percentMmp === 100,
  fn: (availableModels, { model, info }) => {
    if (info.percentLlm === 100) {
      return { ...availableModels, [model]: true };
    }

    const mmpName = supportedLlms[model].mmp!.localName;
    return { ...availableModels, [mmpName]: true };
  },
  target: $availableModels,
});

export const $currentModel = createStore<LlmName>(DEFAULT_LLM);
const $currentMmp = $currentModel.map(
  (currentModel) => supportedLlms[currentModel]?.mmp?.localName
);
const $hasMmp = $currentMmp.map((currentMmp) => !!currentMmp);

export const $modelReady = createStore(false);
export const $modelLoadError = createStore(false);
const setModelLoadError = createEvent<boolean>();
$modelLoadError.on(setModelLoadError, (_, hasErr) => hasErr);

const setModelReady = createEvent<boolean>();
$modelReady.on(setModelReady, (_, ready) => ready);

const $llmPresent = combine(
  $availableModels,
  $currentModel,
  (available, current) => (available ? available[current] : undefined),
  { skipVoid: false }
);

const $mmpPresent = combine(
  $availableModels,
  $currentMmp,
  (available, currentMmp) => {
    if (!available) return undefined;

    return currentMmp ? available[currentMmp] : false;
  },
  { skipVoid: false }
);

const $modelPresent = combine(
  $hasMmp,
  $llmPresent,
  $mmpPresent,
  (hasMmp, llmPresent, mmpPresent) => {
    if (llmPresent === undefined || mmpPresent === undefined) return undefined;
    if (!hasMmp) return llmPresent;
    return llmPresent && mmpPresent;
  },
  { skipVoid: false }
);

export const $missingModel = combine(
  $availableModels,
  $modelPresent,
  (available: null, present: undefined) => {
    if (available === null) return false;
    return present === undefined;
  },
  []
);

export const downloadModelEff = createEffect((model: LlmName) => {
  const { localName, url, mmp } = supportedLlms[model];
  const withMmp = !!mmp;

  if ($llmPresent.getState()) {
    updateDownloadInfo({ model, info: { percentLlm: 100, withMmp } });
  } else {
    downloadModel(url, localName, (percentLlm) =>
      updateDownloadInfo({ model, info: { percentLlm, withMmp } })
    );
  }

  if (!withMmp) return;

  if ($mmpPresent.getState()) {
    updateDownloadInfo({ model, info: { percentMmp: 100, withMmp } });
  } else {
    downloadModel(mmp.url, mmp.localName, (percentMmp) =>
      updateDownloadInfo({ model, info: { percentMmp, withMmp } })
    );
  }
});

const loadModelEff = createEffect<{ llm: LlmName }, void>(({ llm }) => {
  dropModel()
    .then(() => {
      setModelLoadError(false);
      const { localName, mmp } = supportedLlms[llm];

      loadModel(localName, mmp?.localName);
    })
    .then(() => {
      restoreWindowSize();
      setModelReady(true);
    })
    .catch(() => {
      setModelReady(false);
      setModelLoadError(true);
    });
});

// load model on model present
sample({
  source: $currentModel,
  clock: $modelPresent,
  filter: (_, present) => !!present,
  fn: (llm) => ({ llm }),
  target: loadModelEff,
});
