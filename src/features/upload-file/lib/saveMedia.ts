import { copyFile } from '@tauri-apps/api/fs';
import { appDataDir, basename, resolve } from '@tauri-apps/api/path';

import { APP_DIRS } from '@/app/consts/app.const.ts';

export async function saveMedia(source: string): Promise<string> {
  const path = await resolve(await appDataDir(), APP_DIRS.MEDIA, await basename(source));
  await copyFile(source, path);
  return path;
}
