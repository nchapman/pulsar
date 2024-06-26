import { BaseDirectory, readDir } from '@tauri-apps/api/fs';

import { APP_DIRS } from '@/app/consts/app.const.ts';

export async function getAvailableModels(folder = APP_DIRS.MODELS) {
  const entries = await readDir(folder, { dir: BaseDirectory.AppData });

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
