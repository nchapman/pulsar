import { ModelFileData } from '@/entities/model';
import { downloadsManager } from '@/entities/model/managers/downloads-manager.ts';

import { fetchHuggingFaceFiles, getHuggingFaceDownloadLink } from '../api/search-hugging-face.ts';
import { $modelStoreState } from '../model/model-store.model.ts';

export async function startFileDownload(fileData: ModelFileData) {
  const modelData = $modelStoreState.currModelData.getState();

  if (!modelData) return;

  const { author, id, sha, task } = modelData;
  const { isGguf, isMmproj } = fileData;

  const type = isGguf && isMmproj ? 'mmp' : 'llm';
  const modelDto = {
    name: modelData.name,
    author,
    sha,
    task,
    huggingFaceId: id,
  };

  if (type === 'llm') {
    const files = await fetchHuggingFaceFiles(fileData.name);
    const mmp = files.find((i) => i.name.includes('mmproj'));
    if (!mmp) return;

    await downloadsManager.addDownload({
      remoteUrl: getHuggingFaceDownloadLink(modelData.name, mmp.name),
      dto: {
        file: mmp,
        model: { ...modelDto, llmName: fileData.name },
      },
      type: 'mmp',
      name: mmp.name,
    });
  }

  await downloadsManager.addDownload({
    remoteUrl: getHuggingFaceDownloadLink(modelData.name, fileData.name),
    dto: {
      file: fileData,
      model: modelDto,
    },
    type,
    name: fileData.name,
  });
}
