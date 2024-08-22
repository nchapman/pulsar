import { ModelFileType } from '@/db/model-file';
import { ModelFileData } from '@/entities/model';
import { downloadsManager } from '@/entities/model/managers/downloads-manager.ts';
import { getModelFileInfo } from '@/widgets/model-store/lib/getModelFileInfo.ts';

import { getHuggingFaceDownloadLink } from '../api/search-hugging-face.ts';

function getModelFileNames(files: ModelFileData[], type: ModelFileType) {
  return files
    .filter((i) => {
      if (type === 'mmp' && i.isMmproj) return true;
      if (type === 'llm' && i.isGguf) return true;
      return false;
    })
    .map((i) => i.name);
}

function getType(isGguf: boolean, isMmproj: boolean) {
  if (!isGguf) return 'other';

  return isMmproj ? 'mmp' : 'llm';
}

export async function startFileDownload(modelName: string, fileName: string) {
  const { modelData, fileData, files } = await getModelFileInfo(modelName, fileName);

  const { author, id, task = '' } = modelData;
  const { isGguf, isMmproj } = fileData;

  const type = getType(isGguf, isMmproj);

  const modelDto = {
    author,
    huggingFaceId: id,
    task,
    name: modelData.name,
    mmps: getModelFileNames(files, 'mmp'),
    llms: getModelFileNames(files, 'llm'),
  };

  if (type === 'llm') {
    const mmp = files.find((i) => i.name.includes('mmproj'));
    if (mmp) {
      await downloadsManager.addDownload(
        {
          remoteUrl: getHuggingFaceDownloadLink(modelData.name, mmp.name),
          dto: { file: mmp },
          type: 'mmp',
          name: mmp.name,
          modelName: modelData.name,
        },
        modelDto
      );
    }
  }

  return downloadsManager.addDownload(
    {
      remoteUrl: getHuggingFaceDownloadLink(modelData.name, fileData.name),
      dto: { file: fileData },
      type,
      name: fileData.name,
      modelName: modelData.name,
    },
    modelDto
  );
}
