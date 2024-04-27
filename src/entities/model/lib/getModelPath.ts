import { appDataDir, resolve } from '@tauri-apps/api/path';

import { MODELS_DIR_NAME } from '@/entities/model/consts/model.const.ts';

export async function getModelPath(localName: string) {
  const dataDir = await appDataDir();

  return resolve(dataDir, MODELS_DIR_NAME, localName);
}
