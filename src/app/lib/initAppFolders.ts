import { BaseDirectory, createDir, exists } from '@tauri-apps/api/fs';

import { APP_DIRS } from '../consts/app.const.ts';

export async function initAppFolders() {
  return Promise.all(
    Object.values(APP_DIRS).map(async (dir) => {
      if (await exists(dir, { dir: BaseDirectory.AppData })) return;
      await createDir(dir, { recursive: true, dir: BaseDirectory.AppData });
    }, [])
  );
}
