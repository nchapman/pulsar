import { BaseDirectory, readDir } from '@tauri-apps/api/fs';

import { AIModel, models } from '../consts/models.ts';
import { MODELS_DIR } from '../consts/modelsPath.ts';

export async function hasModel(model?: AIModel) {
  const entries = await readDir(MODELS_DIR, { dir: BaseDirectory.AppLocalData });

  if (!model) {
    return entries.length > 0;
  }

  const fileName = models[model].localName;

  return entries.some((entry) => entry.name === fileName);
}
