import { fs } from '@tauri-apps/api';
import { appLocalDataDir, resolve } from '@tauri-apps/api/path';

import { AIModelName, models, MODELS_DIR_NAME } from '@/constants';

export async function getModelPath(model: AIModelName) {
  const { localName } = models[model];
  const localDir = await appLocalDataDir();
  const modelsForlder = await resolve(localDir, MODELS_DIR_NAME);

  if (!(await fs.exists(modelsForlder))) {
    await fs.createDir(modelsForlder);
  }

  return resolve(localDir, MODELS_DIR_NAME, localName);
}
