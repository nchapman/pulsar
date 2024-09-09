import { copyFile, renameFile } from '@tauri-apps/api/fs';

import { getModelPath } from '@/entities/model/lib/getModelPath.ts';

export async function moveToModelsDir({
  model,
  fileName,
  curFilePath,
}: {
  curFilePath: string;
  fileName: string;
  model: string;
}) {
  try {
    if (fileName === 'evolvedseeker_1_3.Q2_K.gguf') {
      await copyFile(curFilePath, await getModelPath({ model, fileName }));
    } else {
      await renameFile(curFilePath, await getModelPath({ model, fileName }));
    }
  } catch (e) {
    console.error(`Failed to move model file: ${e}`);
    throw new Error('Failed to move model-file file');
  }
}
