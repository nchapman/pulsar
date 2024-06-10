import { HuggingFaceModel } from '@/widgets/model-store/types/hugging-face-model.ts';

export const huggingFaceModelsMock: HuggingFaceModel[] = [
  {
    id: '1',
    name: 'GPT-3',
    description: 'GPT-3 is a language model developed by OpenAI.',
    producer: 'OpenAI',
    params: '175B',
    downloads: '100K',
    likes: '100K',
    lastUpdated: '1 day ago',
    publishedBy: 'OpenAI',
  },
  {
    id: '2',
    name: 'GPT-2',
    description: 'GPT-2 is a language model developed by OpenAI.',
    producer: 'OpenAI',
    params: '1.5B',
    downloads: '1M',
    likes: '1M',
    lastUpdated: '1 week ago',
    publishedBy: 'OpenAI',
  },
  {
    id: '3',
    name: 'BERT',
    description: 'BERT is a language model developed by Google.',
    producer: 'Google',
    params: '340M',
    downloads: '500K',
    likes: '500K',
    lastUpdated: '2 weeks ago',
    publishedBy: 'Google',
  },
];
