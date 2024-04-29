import { ModelDownloadInfo } from '../types/model.types.ts';

export function calcPercent(info: ModelDownloadInfo) {
  const { percentLlm, percentMmp, withMmp } = info;
  let percent = percentLlm || 0;

  if (withMmp) {
    percent = Math.floor(((percentLlm || 0) + (percentMmp || 0)) / 2);
  }

  return percent;
}
