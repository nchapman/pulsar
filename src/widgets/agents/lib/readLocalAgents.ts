import { BaseDirectory, readDir } from '@tauri-apps/api/fs';

import { APP_DIRS } from '@/app/consts/app.const.ts';

export async function readLocalAgents(): Promise<string[]> {
  return readDir(APP_DIRS.AGENTS, { dir: BaseDirectory.AppData }).then(
    (data) =>
      data
        .filter((i) => i.children)
        .map((i) => i.name)
        .filter((i) => !!i) as string[]
  );
}
