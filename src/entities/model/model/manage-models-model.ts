// import { combine, createEffect, createEvent, createStore } from 'effector';
//
// import { downloadModel } from '../api/downloadModel';
// import { DEFAULT_LLM } from '../consts/model.const';
// import { LlmName, supportedLlms } from '../consts/supported-llms.const';
// import { calcPercent } from '../lib/calcPercent.ts';
// import { ModelDownloadInfo } from '../types/model.types.ts';
//
//
// export const $modelsDownload = createStore<OptionalRecord<LlmName, ModelDownloadInfo>>({});
// const updateDownloadInfo = createEvent<{ model: LlmName; info: ModelDownloadInfo }>();
//
// $modelsDownload.on(updateDownloadInfo, (store, { info, model }) => {
//   const newState = { ...store, [model]: { ...(store[model] || {}), ...info } };
//
//   newState[model]!.percent = calcPercent(newState[model]!);
//
//   return newState;
// });
//
//
// export const $currentModel = createStore<LlmName>(DEFAULT_LLM);
// const $currentMmp = $currentModel.map(
//   (currentModel) => supportedLlms[currentModel]?.mmp?.localName
// );
// export const $modelReady = createStore(false);
// export const $modelLoadError = createStore(false);
// const setModelLoadError = createEvent<boolean>();
// $modelLoadError.on(setModelLoadError, (_, hasErr) => hasErr);
//
// const setModelReady = createEvent<boolean>();
// $modelReady.on(setModelReady, (_, ready) => ready);
//
//
// export const downloadModelEff = createEffect((model: LlmName) => {
//   const { localName, url, mmp } = supportedLlms[model];
//   const withMmp = !!mmp;
//
//   if ($llmPresent.getState()) {
//     updateDownloadInfo({ model, info: { percentLlm: 100, withMmp } });
//   } else {
//     downloadModel(url, localName, (percentLlm) =>
//       updateDownloadInfo({ model, info: { percentLlm, withMmp } })
//     );
//   }
//
//   if (!withMmp) return;
//
//   if ($mmpPresent.getState()) {
//     updateDownloadInfo({ model, info: { percentMmp: 100, withMmp } });
//   } else {
//     downloadModel(mmp.url, mmp.localName, (percentMmp) =>
//       updateDownloadInfo({ model, info: { percentMmp, withMmp } })
//     );
//   }
// });
//
