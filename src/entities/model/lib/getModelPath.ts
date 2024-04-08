import { fs } from '@tauri-apps/api';
import { appLocalDataDir, resolve } from '@tauri-apps/api/path';

import { AIModel, models } from '../consts/models.ts';
import { MODELS_DIR_NAME } from '../consts/modelsPath.ts';

export async function getModelPath(model: AIModel) {
  const { localName } = models[model];
  const localDir = await appLocalDataDir();
  const modelsForlder = await resolve(localDir, MODELS_DIR_NAME);
  if (!(await fs.exists(modelsForlder))) {
    await fs.createDir(modelsForlder);
  }

  return resolve(localDir, MODELS_DIR_NAME, localName);
}
