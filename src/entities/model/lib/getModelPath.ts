import { fs } from '@tauri-apps/api';
import { appDataDir, resolve } from '@tauri-apps/api/path';

import {
  AIModelName,
  DEFAULT_MULTI_MODAL_MODEL_NAME,
  models,
  MODELS_DIR_NAME,
  multiModalModels,
} from '@/constants';

export async function getModelPath(model: AIModelName) {
  const { localName } = models[model];
  const dataDir = await appDataDir();
  const modelsFolder = await resolve(dataDir, MODELS_DIR_NAME);

  if (!(await fs.exists(modelsFolder))) {
    await fs.createDir(modelsFolder);
  }

  return resolve(dataDir, MODELS_DIR_NAME, localName);
}

// export async function getMultiModalPath(model: MultiModalName) {
export async function getMultiModalPath() {
  const { localName } = multiModalModels[DEFAULT_MULTI_MODAL_MODEL_NAME];
  const dataDir = await appDataDir();
  const modelsFolder = await resolve(dataDir, MODELS_DIR_NAME);

  if (!(await fs.exists(modelsFolder))) {
    await fs.createDir(modelsFolder);
  }

  return resolve(dataDir, MODELS_DIR_NAME, localName);
}
