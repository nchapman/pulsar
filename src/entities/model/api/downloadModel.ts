import { download } from '@/libs/file-transfer.ts';
import { loge, logi } from '@/shared/lib/Logger.ts';

import { getModelPath } from '../lib/getModelPath.ts';

export const downloadModel = async (
  url: string,
  localName: string,
  onProgress: (p: number) => void
) => {
  const pathToSave = await getModelPath(localName);
  logi('downloadModel', `Downloading model to ${pathToSave}`);
  try {
    await download({
      url,
      path: pathToSave,
      progressHandler: (_id, progress, total) => {
        const percent = !total ? 0 : (progress / total) * 100;
        onProgress(percent);
      },
    });
  } catch (e) {
    loge('downloadModel', `Error downloading model: ${e}`);
  }
};
