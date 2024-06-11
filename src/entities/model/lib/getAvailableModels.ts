import { BaseDirectory, readDir } from '@tauri-apps/api/fs';

import { APP_DIRS } from '@/app/consts/app.const.ts';

export async function getAvailableModels() {
  const entries = await readDir(APP_DIRS.MODELS, { dir: BaseDirectory.AppData });

  // TODO: VERIFY HASHES

  const map: Record<string, boolean> = {};

  entries.forEach((i) => {
    if (!i.name?.includes('.gguf')) return;

    const { name } = i;
    map[name] = true;
  });

  const list: string[] = Object.keys(map);

  return [list, map] as const;
}
