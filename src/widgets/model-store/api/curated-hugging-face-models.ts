import { ModelEntry } from '@huggingface/hub';

import { searchHuggingFaceModels } from './search-hugging-face.ts';

type CuratedModel = {
  id: string;
  description: string;
  name: string;
};

const curatedModels: Record<string, CuratedModel[]> = {
  general: [
    {
      description: 'cjpais/llava-1.6-mistral-7b-gguf this is our base model',
      id: '65bc02cbb54ab5b37d4bd060',
      name: 'cjpais/llava-1.6-mistral-7b-gguf',
    },
  ],
};

type curatedModelsKeys = keyof typeof curatedModels;

// In order to display the laterst info about the models this function should iterate over the models and fetch the latest info from the Hugging Face API and merge them with our own descriptions
export async function getCuratedModels(key: curatedModelsKeys): Promise<ModelEntry[]> {
  const baseModels = curatedModels[key];
  let res = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const baseModel of baseModels) {
    const huggingFaceModel = (await searchHuggingFaceModels(baseModel.name))[0];
    res.push(huggingFaceModel);
  }

  res = res.map((model) => ({
    ...model,
    description: curatedModels[key].find((baseModel) => baseModel.id === model.id)?.description,
  }));

  return res;
}
