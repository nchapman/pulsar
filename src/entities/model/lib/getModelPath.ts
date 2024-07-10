import { appDataDir, resolve } from '@tauri-apps/api/path';

import { APP_DIRS } from '@/app/consts/app.const.ts';

export async function getModelPath(localName: string, folder = APP_DIRS.MODELS) {
  const dataDir = await appDataDir();

  return resolve(dataDir, folder, localName);
}
