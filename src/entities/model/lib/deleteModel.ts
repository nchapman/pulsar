import { exists, readDir, removeDir, removeFile } from '@tauri-apps/api/fs';

import { getModelPath } from './getModelPath.ts';

async function deleteEmptyFoldersRecursively(folderPath: string) {
  if (await exists(folderPath)) {
    // eslint-disable-next-line no-restricted-syntax
    for await (const i of await readDir(folderPath)) {
      if (i.children) {
        await deleteEmptyFoldersRecursively(i.path);
      }
    }

    if ((await readDir(folderPath)).length === 0) {
      await removeDir(folderPath);
    }
  }
}

export async function deleteModel(d: { fileName: string; model: string }, isDownload = false) {
  try {
    const path = await getModelPath(d, isDownload);
    const fileExists = await exists(path);

    if (fileExists) {
      await removeFile(path);
      deleteEmptyFoldersRecursively(
        await getModelPath({ model: d.model.split('/')[0], fileName: '' }, isDownload)
      );
    }
  } catch (e) {
    console.error('Failed to delete model-file file', e);
  }
}
