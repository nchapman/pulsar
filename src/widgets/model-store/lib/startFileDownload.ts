import { ModelFileData } from '@/entities/model';
import { downloadsManager } from '@/entities/model/managers/downloads-manager.ts';

import { getHuggingFaceDownloadLink } from '../api/search-hugging-face.ts';
import { $modelStoreState } from '../model/model-store.model.ts';

export async function startFileDownload(fileData: ModelFileData) {
  const modelData = $modelStoreState.currModelData.getState();
  if (!modelData) return;

  const { name, author, id, sha, task } = modelData;
  const { isGguf, isMmproj } = fileData;

  const type = isGguf && isMmproj ? 'mmp' : 'llm';

  await downloadsManager.addDownload({
    remoteUrl: getHuggingFaceDownloadLink(modelData.name, fileData.name),
    dto: {
      file: fileData,
      model: {
        name,
        author,
        sha,
        task,
        huggingFaceId: id,
      },
    },
    type,
    name,
  });
}
