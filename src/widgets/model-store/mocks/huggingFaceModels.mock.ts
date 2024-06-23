import { HuggingFaceModel, ModelFile } from '@/widgets/model-store/types/hugging-face-model.ts';

export const huggingFaceModelMock: HuggingFaceModel = {
  author: 'Lewdiculous',
  downloads: 20040,
  downloadsAllTime: 20040,
  gated: false,
  id: '6660ac8cc3fc813841f84b53',
  likes: 57,
  name: 'Lewdiculous/L3-8B-Stheno-v3.2-GGUF-IQ-Imatrix',
  private: false,
  sha: 'c8d3a9bf1654e10a813815f8b18faf8db65ae1d0',
  tags: ['gguf', 'roleplay', 'llama3', 'sillytavern', 'en', 'license:cc-by-nc-4.0', 'region:us'],
  task: undefined,
  updatedAt: new Date(),
};

export const modelFileMock: ModelFile = {
  name: 'DeepSeek-Coder-V2-Lite-Instruct-f32.gguf',
  size: 6328456960,
  fitsInMemory: true,
};
