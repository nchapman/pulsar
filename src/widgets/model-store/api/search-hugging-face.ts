import { listFiles, listModels } from '@huggingface/hub';

import { getSystemInfo } from '@/features/system/system.ts';
import { HuggingFaceModel } from '@/widgets/model-store/types/hugging-face-model.ts';

const HUGGING_FACE_BASE_URL = 'https://huggingface.co';

export const searchHuggingFaceModels = async (query: string) => {
  const modelGenerator = listModels({
    search: { query: `${query} gguf` },
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
  });

  const models = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const model of modelGenerator) {
    models.push(model);
  }

  return models as HuggingFaceModel[];
};

export const fetchHuggingFaceFiles = async (modelId: string): Promise<any> => {
  const systemInfo = await getSystemInfo();
  const filesGenerator = listFiles({
    repo: modelId,
  });

  const files = [];

  // eslint-disable-next-line no-restricted-syntax
  for await (const file of filesGenerator) {
    if (file.path.endsWith('.gguf')) {
      files.push({
        name: file.path,
        size: file.size,
        fitsInMemory: file.size < systemInfo.availableMemory,
      });
    }
  }

  return files;
};

export const getHuggingFaceDownloadLink = (modelId: string, file: string): string =>
  // https://huggingface.co/cjpais/llava-1.6-mistral-7b-gguf/resolve/main/llava-v1.6-mistral-7b.Q4_K_M.gguf?download=true
  `${HUGGING_FACE_BASE_URL}/${modelId}/resolve/main/${file}`;
