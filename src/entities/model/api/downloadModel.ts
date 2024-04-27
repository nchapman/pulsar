import { download } from 'tauri-plugin-upload-api';

import { getModelPath } from '../lib/getModelPath.ts';

export const downloadModel = async (
  url: string,
  localName: string,
  onProgress: (p: number) => void
) => {
  let progress = 0;
  let total = 0;
  const pathToSave = await getModelPath(localName);

  download(url, pathToSave, (downloaded, totalCur) => {
    progress += downloaded;
    total = totalCur;
    const percent = !total ? 0 : (progress / total) * 100;
    onProgress(percent);
  });
};
