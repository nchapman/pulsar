import { exists, removeFile } from '@tauri-apps/api/fs';

import { getModelPath } from '@/entities/model/lib/getModelPath.ts';

export async function deleteModel(d: { fileName: string; model: string }, isDownload = false) {
  try {
    const path = await getModelPath(d, isDownload);
    const fileExists = await exists(path);

    if (fileExists) {
      await removeFile(path);
    }
  } catch (e) {
    console.error('Failed to delete model-file file', e);
  }
}
