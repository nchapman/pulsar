export type AppStatus = 'initial' | 'missingModel' | 'loading' | 'ready' | 'error';

export type ModelDownloadInfo = {
  percentLlm?: number;
  percentMmp?: number;
  withMmp: boolean;
  percent?: number;
};
