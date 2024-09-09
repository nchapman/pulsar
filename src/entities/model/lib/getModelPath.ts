import { appDataDir, resolve } from '@tauri-apps/api/path';

import { APP_DIRS } from '@/app/consts/app.const.ts';

export async function getModelPath(
  {
    model,
    fileName,
  }: {
    fileName: string;
    model: string;
  },
  isDownload = false
) {
  const dataDir = await appDataDir();
  const folder = isDownload ? APP_DIRS.DOWNLOADS : APP_DIRS.MODELS;

  return resolve(dataDir, folder, model, fileName);
}
