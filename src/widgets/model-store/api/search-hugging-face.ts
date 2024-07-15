import { listFiles } from '@huggingface/hub';

import { ModelFileData } from '@/entities/model';
import { HuggingFaceModel } from '@/entities/model/types/hugging-face-model.ts';
import { getSystemInfo } from '@/features/system/system.ts';
import { listModels } from '@/widgets/model-store/api/listModels.ts';
import { ModelSorting, ModelSortingData } from '@/widgets/model-store/types/model-sorting.ts';

const HUGGING_FACE_BASE_URL = 'https://huggingface.co';

export const searchHuggingFaceModels = async (query: string, sorting?: ModelSorting) => {
  // @ts-ignore
  const { sort, direction } = sorting ? ModelSortingData[sorting] : {};

  const modelGenerator = listModels({
    search: { query: `${query}` },
    additionalFields: [
      'tags',
      'config',
      'author',
      'sha',
      'cardData',
      'disabled',
      'downloadsAllTime',
      'transformersInfo',
      'library_name',
      'spaces',
      'safetensors',
      'model-index',
    ],
    limit: 100,
    sort,
    direction,
  });

  const models = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const model of modelGenerator) {
    models.push(model);
  }

  return models as HuggingFaceModel[];
};

export const fetchHuggingFaceFiles = async (modelId: string): Promise<ModelFileData[]> => {
  const systemInfo = await getSystemInfo();
  const filesGenerator = listFiles({
    repo: modelId,
  });

  const files: ModelFileData[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for await (const file of filesGenerator) {
    const data: ModelFileData = {
      name: file.path,
      size: file.size,
      isGguf: file.path.endsWith('.gguf'),
      isMmproj: file.path.includes('mmproj'),
    };

    if (data.isGguf) {
      data.fitsInMemory = file.size < systemInfo.availableMemory;
    }

    files.push(data);
  }

  return files;
};

export const getHuggingFaceDownloadLink = (modelId: string, file: string): string =>
  // https://huggingface.co/cjpais/llava-1.6-mistral-7b-gguf/resolve/main/llava-v1.6-mistral-7b.Q4_K_M.gguf?download=true
  `${HUGGING_FACE_BASE_URL}/${modelId}/resolve/main/${file}`;
