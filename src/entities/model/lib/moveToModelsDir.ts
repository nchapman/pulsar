import { renameFile } from '@tauri-apps/api/fs';

import { getModelPath } from '@/entities/model/lib/getModelPath.ts';

export async function moveToModelsDir(curFilePath: string, localName: string) {
  try {
    await renameFile(curFilePath, await getModelPath(localName));
  } catch {
    console.error('Failed to move model file');
    throw new Error('Failed to move model file');
  }
}
