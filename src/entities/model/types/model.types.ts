export type AppStatus = 'initial' | 'missingModel' | 'loading' | 'ready' | 'error';

export interface ModelFileData {
  name: string;
  size: number;
  isGguf: boolean;
  fitsInMemory?: boolean;
  isMmproj: boolean;
}

export interface ModelData {
  huggingFaceId: string;
  name: string;
  mmpName?: string | null;
  llmName?: string | null;
  author: string;
  sha: string;
  task?: string;
}

export interface ModelDto {
  model: ModelData;
  file: ModelFileData;
}

export type ModelDownloadInfo = {
  percentLlm?: number;
  percentMmp?: number;
  withMmp: boolean;
  percent?: number;
};
