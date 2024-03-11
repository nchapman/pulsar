import { createDir } from '@tauri-apps/api/fs';
import { BaseDirectory } from '@tauri-apps/api/path';
import { download } from 'tauri-plugin-upload-api';

import { models } from '../consts/models.ts';
import { MODELS_DIR } from '../consts/modelsPath.ts';
import { getModelPath } from '../lib/getModelPath.ts';

export async function downloadModel(
  model: keyof typeof models,
  handler: Parameters<typeof download>[2]
) {
  const { url } = models[model];

  await createDir(MODELS_DIR, { dir: BaseDirectory.AppLocalData, recursive: true });

  const pathToSave = await getModelPath(model);

  download(url, pathToSave, handler);
}
