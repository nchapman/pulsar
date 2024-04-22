import { BaseDirectory, createDir, exists, readDir } from '@tauri-apps/api/fs';

import { AIModelName, models, MODELS_DIR_NAME } from '../../../constants.ts';

export async function hasModel(model?: AIModelName) {
  if (!(await exists(MODELS_DIR_NAME, { dir: BaseDirectory.AppLocalData }))) {
    await createDir(MODELS_DIR_NAME, { recursive: true, dir: BaseDirectory.AppLocalData });
  }

  const entries = await readDir(MODELS_DIR_NAME, { dir: BaseDirectory.AppLocalData });

  if (!model) {
    return entries.length > 0;
  }

  const fileName = models[model].localName;

  return entries.some((entry) => entry.name === fileName);
}
