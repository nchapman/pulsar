import { combine, createEffect, createEvent, createStore, sample } from 'effector';

import { downloadModel } from '../api/downloadModel';
import { DEFAULT_LLM } from '../consts/model.const';
import { LlmName, supportedLlms } from '../consts/supported-llms.const';
import { getAvailableModels } from '../lib/getAvailableModels';
import { dropModel, loadModel } from './model-state';

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
export const getAvailableModelsEff = createEffect(getAvailableModels);

$availableModels.on(getAvailableModelsEff.doneData, (_, availableModels) => availableModels);

// download info / false on downloaded
type ModelDownloadInfo = {
  percentLlm?: number;
  percentMmp?: number;
  withMmp: boolean;
  percent?: number;
};

export const $modelsDownload = createStore<OptionalRecord<LlmName, ModelDownloadInfo>>({});
const updateDownloadInfo = createEvent<{ model: LlmName; info: ModelDownloadInfo }>();

function calcPercent(info: ModelDownloadInfo) {
  const { percentLlm, percentMmp, withMmp } = info;
  let percent = percentLlm || 0;

  if (withMmp) {
    percent = Math.floor(((percentLlm || 0) + (percentMmp || 0)) / 2);
  }

  return percent;
}

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

    const mmpName = supportedLlms[model].mmp!.name;
    return { ...availableModels, [mmpName]: true };
  },
  target: $availableModels,
});

const $currentModel = createStore<LlmName>(DEFAULT_LLM);
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

const $llmPresent = combine($availableModels, $currentModel, (available, current) => {
  console.log(available, current);
  return !!available?.[current];
});

const $mmpPresent = combine($availableModels, $currentMmp, (available, currentMmp) =>
  currentMmp ? !!available?.[currentMmp] : false
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

export const $hasCheckedModels = createStore(false);

const loadModelEff = createEffect<{ llm: LlmName }, void>(({ llm }) => {
  dropModel()
    .then(() => {
      setModelLoadError(false);
      loadModel(llm);
    })
    .then(() => setModelReady(true))
    .catch(() => {
      setModelReady(false);
      setModelLoadError(true);
    });
});

// load model on model present
sample({
  source: $currentModel,
  clock: $modelPresent,
  filter: (_, present) => present,
  fn: (llm) => ({ llm }),
  target: loadModelEff,
});
