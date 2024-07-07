import { CuratedModel, HuggingFaceModel } from '@/entities/model/types/hugging-face-model.ts';
import { searchHuggingFaceModels } from '@/widgets/model-store/api/search-hugging-face.ts';

export const curatedModels: CuratedModel[] = [
  {
    author: 'cjpais',
    downloads: 17859,
    downloadsAllTime: 74841,
    gated: false,
    id: '65bc02cbb54ab5b37d4bd060',
    likes: 75,
    name: 'cjpais/llava-1.6-mistral-7b-gguf',
    private: false,
    sha: '6019df415777605a8364e2668aa08b7e354bf0ba',
    tags: ['gguf', 'llava', 'image-text-to-text', 'license:apache-2.0', 'region:us'],
    task: 'image-text-to-text',
    updatedAt: new Date(),
    logo: '',
    description:
      "Luna AI 7B (Q4_K_M) is Alibaba Group's latest language model. Trained for decoding tasks, it excels across domains and matches human preferences. ",
  },
];

export const curatedModelsData: Record<string, HuggingFaceModel> = {};

curatedModels.forEach((i) =>
  searchHuggingFaceModels(i.name).then((res) => {
    const [model] = res;
    curatedModelsData[model.name] = model;
  })
);
