import { appDataDir, resolve } from '@tauri-apps/api/path';

import { APP_DIRS } from '@/app/consts/app.const.ts';

export async function getAgentPath(fileName: string) {
  const dataDir = await appDataDir();
  const folder = APP_DIRS.AGENTS;

  return resolve(dataDir, folder, fileName);
}
