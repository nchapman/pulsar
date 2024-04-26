import { BaseDirectory, createDir, exists, readDir } from '@tauri-apps/api/fs';

import { MODELS_DIR_NAME } from '@/entities/model/consts/model.const.ts';
import { LlmName } from '@/entities/model/consts/supported-llms.const.ts';

export async function getAvailableModels() {
  if (!(await exists(MODELS_DIR_NAME, { dir: BaseDirectory.AppData }))) {
    await createDir(MODELS_DIR_NAME, { recursive: true, dir: BaseDirectory.AppData });
  }

  const entries = await readDir(MODELS_DIR_NAME, { dir: BaseDirectory.AppData });

  return entries.reduce((acc, m) => ({ ...acc, [m.name || 'unknown']: true }), {}) as Record<
    LlmName,
    boolean
  >;
}
