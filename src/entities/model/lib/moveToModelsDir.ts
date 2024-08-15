import { copyFile, renameFile } from '@tauri-apps/api/fs';

import { getModelPath } from '@/entities/model/lib/getModelPath.ts';

export async function moveToModelsDir(curFilePath: string, localName: string) {
  try {
    if (localName === 'evolvedseeker_1_3.Q2_K.gguf') {
      await copyFile(curFilePath, await getModelPath(localName));
    } else {
      await renameFile(curFilePath, await getModelPath(localName));
    }
  } catch (e) {
    console.error(`Failed to move model file: ${e}`);
    throw new Error('Failed to move model-file file');
  }
}
