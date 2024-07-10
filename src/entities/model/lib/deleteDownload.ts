import { exists, removeFile } from '@tauri-apps/api/fs';

import { APP_DIRS } from '@/app/consts/app.const.ts';
import { getModelPath } from '@/entities/model/lib/getModelPath.ts';

export async function deleteDownload(localName: string) {
  try {
    const path = await getModelPath(localName, APP_DIRS.DOWNLOADS);
    const fileExists = await exists(path);

    if (fileExists) {
      await removeFile(path);
    }
  } catch (e) {
    console.error('Failed to delete download file');
  }
}
