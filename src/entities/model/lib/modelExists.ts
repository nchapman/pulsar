import { BaseDirectory, createDir, exists, readDir } from '@tauri-apps/api/fs';

import { MODELS_DIR_NAME } from '../consts/model.const.ts';
import { LlmName, supportedLlms } from '../consts/supported-llms.const.ts';

export async function modelExists(modelName: LlmName, isMmp = false) {
  if (!(await exists(MODELS_DIR_NAME, { dir: BaseDirectory.AppData }))) {
    await createDir(MODELS_DIR_NAME, { recursive: true, dir: BaseDirectory.AppData });
  }

  const entries = await readDir(MODELS_DIR_NAME, { dir: BaseDirectory.AppData });

  const { localName, mmp } = supportedLlms[modelName];

  const fileName = isMmp ? mmp?.localName : localName;

  return entries.some((entry) => entry.name === fileName);
}
