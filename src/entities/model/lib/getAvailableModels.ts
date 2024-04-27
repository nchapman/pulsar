import { BaseDirectory, createDir, exists, readDir } from '@tauri-apps/api/fs';

import { MODELS_DIR_NAME } from '@/entities/model/consts/model.const.ts';
import { LlmName } from '@/entities/model/consts/supported-llms.const.ts';

export async function getAvailableModels() {
  if (!(await exists(MODELS_DIR_NAME, { dir: BaseDirectory.AppData }))) {
    await createDir(MODELS_DIR_NAME, { recursive: true, dir: BaseDirectory.AppData });
  }

  const entries = await readDir(MODELS_DIR_NAME, { dir: BaseDirectory.AppData });

  return entries.reduce<OptionalRecord<LlmName, boolean>>((acc, i) => {
    if (!i.name?.includes('.gguf')) return acc;
    const name = i.name as LlmName;
    acc[name] = true;
    return acc;
  }, {}) as Record<LlmName, boolean>;
}
