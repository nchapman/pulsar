import { appDataDir, resolve } from '@tauri-apps/api/path';

import { APP_DIRS } from '@/app/consts/app.const.ts';

export async function getDownloadPath(localName: string) {
  const dataDir = await appDataDir();

  return resolve(dataDir, APP_DIRS.DOWNLOADS, localName);
}
