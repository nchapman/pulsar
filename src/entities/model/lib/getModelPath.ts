import { fs } from '@tauri-apps/api';
import { appDataDir, resolve } from '@tauri-apps/api/path';

import { MODELS_DIR_NAME } from '@/entities/model/consts/model.const.ts';
import { supportedLlms } from '@/entities/model/consts/supported-llms.const.ts';
import { supportedMmms } from '@/entities/model/consts/supported-mmms.const.ts';
import { LlmName, MmmName } from '@/entities/model/types/model.types.ts';

export async function getModelPath(modelName: LlmName | MmmName, isMmm: boolean = false) {
  const data = isMmm ? supportedMmms[modelName] : supportedLlms[modelName];

  const { localName } = data;

  const dataDir = await appDataDir();
  const modelsFolder = await resolve(dataDir, MODELS_DIR_NAME);

  if (!(await fs.exists(modelsFolder))) {
    await fs.createDir(modelsFolder);
  }

  return resolve(dataDir, MODELS_DIR_NAME, localName);
}
