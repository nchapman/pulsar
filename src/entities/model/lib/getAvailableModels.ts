import { BaseDirectory, readDir } from '@tauri-apps/api/fs';

import { APP_DIRS } from '@/app/consts/app.const.ts';
import { LlmName } from '@/entities/model/consts/supported-llms.const.ts';

export async function getAvailableModels() {
  const entries = await readDir(APP_DIRS.MODELS, { dir: BaseDirectory.AppData });

  return entries.reduce<OptionalRecord<LlmName, boolean>>((acc, i) => {
    if (!i.name?.includes('.gguf')) return acc;
    const name = i.name as LlmName;
    acc[name] = true;
    return acc;
  }, {}) as Record<LlmName, boolean>;
}
