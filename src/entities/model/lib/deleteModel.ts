import { removeFile } from '@tauri-apps/api/fs';

import { getModelPath } from '@/entities/model/lib/getModelPath.ts';

export async function deleteModel(localName: string) {
  try {
    await removeFile(await getModelPath(localName));
  } catch {
    console.error('Failed to delete model file');
  }
}
