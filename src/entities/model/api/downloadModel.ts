import { download, loge, logi } from '@/shared/lib/func';

import { getModelPath } from '../lib/getModelPath.ts';

export const downloadModel = async ({
  fileName,
  model,
  url,
  onProgress,
}: {
  model: string;
  url: string;
  fileName: string;
  onProgress: (p: number) => void;
}) => {
  const pathToSave = await getModelPath({ fileName, model });
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
