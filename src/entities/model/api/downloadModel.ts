import { createDir } from '@tauri-apps/api/fs';
import { BaseDirectory } from '@tauri-apps/api/path';
import { download } from 'tauri-plugin-upload-api';

import { AIModelName, models, MODELS_DIR_NAME } from '@/constants.ts';

import { getModelPath } from '../lib/getModelPath.ts';

export async function downloadModel(model: AIModelName, handler: Parameters<typeof download>[2]) {
  const { url } = models[model];

  await createDir(MODELS_DIR_NAME, { dir: BaseDirectory.AppData, recursive: true });

  const pathToSave = await getModelPath(model);

  download(url, pathToSave, handler);
}
