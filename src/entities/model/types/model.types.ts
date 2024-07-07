export type AppStatus = 'initial' | 'missingModel' | 'loading' | 'ready' | 'error';

export interface ModelFileData {
  name: string;
  size: number;
  isGguf: boolean;
  fitsInMemory?: boolean;
  isMmproj: boolean;
}

export interface ModelDto {
  huggingFaceId: string;
  name: string;
  author: string;
  task?: string;
  llms: string[];
  mmps: string[];
}

export interface ModelFileDto {
  file: ModelFileData;
}

export type ModelDownloadInfo = {
  percentLlm?: number;
  percentMmp?: number;
  withMmp: boolean;
  percent?: number;
};
