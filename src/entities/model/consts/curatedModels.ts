import { ModelDto } from '../types/model.types.ts';

export const curatedModels: Record<string, ModelDto> = {
  'llava-v1.6-mistral-7b': {
    model: {
      name: 'cjpais/llava-1.6-mistral-7b-gguf',
      sha: '6019df415777605a8364e2668aa08b7e354bf0ba',
      mmpName: 'mmproj-model-f16.gguf',
      task: 'image-text-to-text',
      huggingFaceId: '65bc02cbb54ab5b37d4bd060',
      author: 'cjpais',
    },
    file: {
      isGguf: true,
      name: 'llava-v1.6-mistral-7b.Q4_K_M.gguf',
      size: 0,
      isMmproj: false,
      fitsInMemory: true,
    },
  },
  'mmproj-model-f16': {
    model: {
      name: 'cjpais/llava-1.6-mistral-7b-gguf',
      sha: '6019df415777605a8364e2668aa08b7e354bf0ba',
      mmpName: 'mmproj-model-f16.gguf',
      task: 'image-text-to-text',
      huggingFaceId: '65bc02cbb54ab5b37d4bd060',
      author: 'cjpais',
    },
    file: {
      isGguf: true,
      name: 'mmproj-model-f16.gguf',
      size: 0,
      isMmproj: true,
      fitsInMemory: true,
    },
  },
};
