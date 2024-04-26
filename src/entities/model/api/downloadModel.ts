import { createDir } from '@tauri-apps/api/fs';
import { BaseDirectory } from '@tauri-apps/api/path';
import { download } from 'tauri-plugin-upload-api';

import { MODELS_DIR_NAME } from '@/entities/model/consts/model.const.ts';
import { supportedLlms } from '@/entities/model/consts/supported-llms.const.ts';
import { supportedMmms } from '@/entities/model/consts/supported-mmms.const.ts';
import { LlmName, MmmName } from '@/entities/model/types/model.types.ts';

import { getModelPath } from '../lib/getModelPath.ts';

export async function downloadModel(
  model: LlmName | MmmName,
  isMmm: boolean,
  handler: Parameters<typeof download>[2]
) {
  const { url } = isMmm ? supportedMmms[model] : supportedLlms[model];

  await createDir(MODELS_DIR_NAME, { dir: BaseDirectory.AppData, recursive: true });

  const pathToSave = await getModelPath(model);

  download(url, pathToSave, handler);
}
