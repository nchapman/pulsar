import { copyFile, removeFile } from '@tauri-apps/api/fs';
import { appDataDir, basename, resolve } from '@tauri-apps/api/path';

import { APP_DIRS } from '@/app/consts/app.const.ts';
import { suid } from '@/shared/lib/func';

export async function saveMedia(source: string): Promise<string> {
  const path = await resolve(
    await appDataDir(),
    APP_DIRS.MEDIA,
    `${suid()}-${await basename(source)}`
  );

  await copyFile(source, path);
  return path;
}

export async function deleteMedia(path: string): Promise<void> {
  await removeFile(path);
}
