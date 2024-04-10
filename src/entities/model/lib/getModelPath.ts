import { fs } from '@tauri-apps/api';
import { appDataDir, resolve } from '@tauri-apps/api/path';

import { AIModelName, models, MODELS_DIR_NAME } from '@/constants';

export async function getModelPath(model: AIModelName) {
  const { localName } = models[model];
  const dataDir = await appDataDir();
  const modelsFolder = await resolve(dataDir, MODELS_DIR_NAME);

  if (!(await fs.exists(modelsFolder))) {
    await fs.createDir(modelsFolder);
  }

  return resolve(dataDir, MODELS_DIR_NAME, localName);
}
