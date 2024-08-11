import { appDataDir, resolve } from '@tauri-apps/api/path';
import { open as openPath } from '@tauri-apps/api/shell';

import { APP_DIRS } from '@/app/consts/app.const.ts';

export async function openModelsDir() {
  const dataDir = await appDataDir();
  const modelsDir = await resolve(dataDir, APP_DIRS.MODELS);
  openPath(modelsDir);
}
