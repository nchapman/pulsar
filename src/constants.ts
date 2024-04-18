export const models = {
  'llava-v1.6-mistral-7b': {
    localName: 'llava-v1.6-mistral-7b.Q4_K_M.gguf',
    url: 'https://huggingface.co/cjpais/llava-1.6-mistral-7b-gguf/resolve/main/llava-v1.6-mistral-7b.Q4_K_M.gguf?download=true',
    size: '4.37 GB',
    name: 'Llava v1.6 (Mistral 7b)',
    desc: 'Good balance of quality and resource usage.',
  },
  'llava-v1.6-34b': {
    localName: 'llava-v1.6-34b.Q4_K_M.gguf',
    url: 'https://huggingface.co/cjpais/llava-v1.6-34B-gguf/resolve/main/llava-v1.6-34b.Q4_K_M.gguf?download=true',
    size: '20.7 GB',
    name: 'Llava v1.6 (34b)',
    desc: 'Good balance of quality and resource usage.',
  },
  'nous-hermes-2-solar-10.7b': {
    localName: 'nous-hermes-2-solar-10.7b.Q4_K_M.gguf',
    url: 'https://huggingface.co/TheBloke/Nous-Hermes-2-SOLAR-10.7B-GGUF/resolve/main/nous-hermes-2-solar-10.7b.Q4_K_M.gguf?download=true',
    size: '6.46 GB',
    name: 'Nous Hermes 2 (Solar 10.7b)',
    desc: 'Good balance of quality and resource usage.',
  },
};

export const multiModalModels = {
  'mmproj-model-f16.gguf': {
    localName: 'mmproj-model-f16.gguf',
    url: 'https://huggingface.co/cjpais/llava-1.6-mistral-7b-gguf/resolve/main/mmproj-model-f16.gguf?download=true',
    name: 'Llava v1.6 (Mistral 7b)',
  },
};

export type AIModelName = keyof typeof models;
export type MultiModalName = keyof typeof multiModalModels;
export const DEFAULT_MODEL_NAME: AIModelName = 'llava-v1.6-mistral-7b';
export const DEFAULT_MULTI_MODAL_MODEL_NAME: MultiModalName = 'mmproj-model-f16.gguf';
export const MODELS_DIR_NAME = 'models';

