import { removeFile } from '@tauri-apps/api/fs';

import { APP_DIRS } from '@/app/consts/app.const.ts';
import { getModelPath } from '@/entities/model/lib/getModelPath.ts';

export async function deleteDownload(localName: string) {
  try {
    await removeFile(await getModelPath(localName, APP_DIRS.DOWNLOADS));
  } catch {
    console.error('Failed to delete download file');
  }
}
