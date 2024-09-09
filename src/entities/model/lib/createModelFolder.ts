import { BaseDirectory, createDir, exists } from '@tauri-apps/api/fs';

import { APP_DIRS } from '@/app/consts/app.const.ts';

function getModelPath(modelName: string, downloads = false) {
  const base = downloads ? APP_DIRS.DOWNLOADS : APP_DIRS.MODELS;
  return `${base}/${modelName}`;
}

export async function createModelFolder(modelName: string, downloads = false) {
  const modelDir = getModelPath(modelName, downloads);

  if (await exists(modelDir, { dir: BaseDirectory.AppData })) return;
  await createDir(modelDir, { recursive: true, dir: BaseDirectory.AppData });
}
