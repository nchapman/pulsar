import { ModelFileType } from '@/db/model-file';
import { ModelFileData } from '@/entities/model';
import { downloadsManager } from '@/entities/model/managers/downloads-manager.ts';

import {
  fetchHuggingFaceFiles,
  getHuggingFaceDownloadLink,
  searchHuggingFaceModels,
} from '../api/search-hugging-face.ts';

function getModelFileNames(files: ModelFileData[], type: ModelFileType) {
  return files
    .filter((i) => {
      if (type === 'mmp' && i.isMmproj) return true;
      if (type === 'llm' && i.isGguf) return true;
      return false;
    })
    .map((i) => i.name);
}

export async function startFileDownload(modelName: string, fileName: string) {
  const [modelData] = await searchHuggingFaceModels(modelName);
  if (!modelData) throw new Error('Model not found');

  const files = await fetchHuggingFaceFiles(modelData.name);
  const fileData = files.find((i) => i.name === fileName);
  if (!fileData) throw new Error('File not found');

  const { author, id, task = '' } = modelData;
  const { isGguf, isMmproj } = fileData;

  const type = isGguf && isMmproj ? 'mmp' : 'llm';

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
