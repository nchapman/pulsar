import { BaseDirectory, readDir } from '@tauri-apps/api/fs';

import { AIModelName, models, MODELS_DIR_NAME } from '@/constants';

export async function modelExists(model?: AIModelName) {
  const entries = await readDir(MODELS_DIR_NAME, { dir: BaseDirectory.AppLocalData });

  if (!model) {
    return entries.length > 0;
  }

  const fileName = models[model].localName;

  return entries.some((entry) => entry.name === fileName);
}
