import { BaseDirectory, readDir } from '@tauri-apps/api/fs';

import { APP_DIRS } from '@/app/consts/app.const.ts';

export async function getAvailableModels(folder = APP_DIRS.MODELS) {
  const entries = await readDir(folder, { dir: BaseDirectory.AppData, recursive: true });

  const map: Record<string, Record<string, Record<string, boolean>>> = {};

  entries.forEach((i) => {
    if (!i.children?.length || !i.name) return; // skip files

    const author = i.name;
    map[author] = {};

    i.children.forEach((j) => {
      if (!j.children?.length || !j.name) return; // skip files

      const modelName = j.name;
      map[author][modelName] = {};

      j.children?.forEach((k) => {
        const fileName = k.name;
        if (!fileName) return;
        map[author][modelName][fileName] = true;
      });
    });
  });

  return map;
}
