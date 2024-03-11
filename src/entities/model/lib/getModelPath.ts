import { appLocalDataDir, resolve } from '@tauri-apps/api/path';

import { AIModel, models } from '../consts/models.ts';
import { MODELS_DIR } from '../consts/modelsPath.ts';

export async function getModelPath(model: AIModel) {
  const { localName } = models[model];
  const localDir = await appLocalDataDir();
  return resolve(localDir, MODELS_DIR, localName);
}
