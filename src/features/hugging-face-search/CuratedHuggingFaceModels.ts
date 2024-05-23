import { ModelEntry } from '@huggingface/hub';

type CuratedModel = {
  id: string;
  description: string;
};

const curatedModels: Record<string, CuratedModel[]> = {
  general: [
    {
      description:
        'GPT-2 is a large transformer-based language model with 1.5 billion parameters, trained on a large-scale dataset of 8 million web pages. It is capable of generating human-like text and has been used in a wide range of applications.',
      id: 'gpt-2',
    },
  ],
};

// In order to display the laterst info about the models this function should iterate over the models and fetch the latest info from the Hugging Face API and merge them with our own descriptions
export async function getCuratedModels(): Promise<ModelEntry[]> {
  // const models = curatedModels.general.map((model) => {
  //   return {
  //     id: model.id,
  //     name: model.id,
  //     private: false,
  //     gated: false,
  //     likes: 0,
  //     downloads: 0,
  //     updatedAt: new Date(),
  //   };
  // });
  // return models;

  return [];
}

