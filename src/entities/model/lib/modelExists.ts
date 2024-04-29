import { BaseDirectory, createDir, exists, readDir } from '@tauri-apps/api/fs';

import { APP_DIRS } from '@/app/consts/app.const.ts';

import { LlmName, supportedLlms } from '../consts/supported-llms.const.ts';

export async function modelExists(modelName: LlmName, isMmp = false) {
  if (!(await exists(APP_DIRS.MODELS, { dir: BaseDirectory.AppData }))) {
    await createDir(APP_DIRS.MODELS, { recursive: true, dir: BaseDirectory.AppData });
  }

  const entries = await readDir(APP_DIRS.MODELS, { dir: BaseDirectory.AppData });

  const { localName, mmp } = supportedLlms[modelName];

  const fileName = isMmp ? mmp?.localName : localName;

  return entries.some((entry) => entry.name === fileName);
}
