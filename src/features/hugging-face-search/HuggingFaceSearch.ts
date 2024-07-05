import { listFiles, listModels } from '@huggingface/hub';
import { getSystemInfo } from '../system/system';

const HUGGING_FACE_BASE_URL = 'https://huggingface.co';

export const searchHuggingFaceModel = async (query: string) => {
  const modelGenerator = listModels({
    search: { query: query + ' GGUF' },
    limit: 10,
  });

  let models = [];
  for await (const model of modelGenerator) {
    models.push(model);
  }

  return models;
};

export const fetchHuggingFaceFiles = async (modelId: string): Promise<any> => {
  const systemInfo = await getSystemInfo();
  const filesGenerator = listFiles({
    repo: modelId,
  });

  let files = [];

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

