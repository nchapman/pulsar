export type LlmName =
  | 'llava-v1.6-mistral-7b.Q4_K_M.gguf'
  | 'llava-v1.6-34b.Q4_K_M.gguf'
  | 'nous-hermes-2-solar-10.7b.Q4_K_M.gguf';

export interface ModelMetaData {
  localName: string;
  url: string;
  size: string;
  name: string;
  desc: string;
  imgSupport?: boolean;
  byteSize: number;
  mmp?: {
    name: string;
    localName: string;
    url: string;
    byteSize: number;
  };
}

export const supportedLlms: Record<LlmName, ModelMetaData> = {
  'llava-v1.6-mistral-7b.Q4_K_M.gguf': {
    localName: 'llava-v1.6-mistral-7b.Q4_K_M.gguf',
    url: 'https://huggingface.co/cjpais/llava-1.6-mistral-7b-gguf/resolve/main/llava-v1.6-mistral-7b.Q4_K_M.gguf?download=true',
    size: '4.37 GB',
    byteSize: 4368439552,
    name: 'Llava v1.6 (Mistral 7b)',
    desc: 'Good balance of quality and resource usage.',
    imgSupport: true,
    mmp: {
      name: 'MultiModal Projector (F16)',
      localName: 'mmproj-model-file-f16.gguf',
      byteSize: 624451168,
      url: 'https://huggingface.co/cjpais/llava-1.6-mistral-7b-gguf/resolve/main/mmproj-model-f16.gguf?download=true',
    },
  },
  'llava-v1.6-34b.Q4_K_M.gguf': {
    localName: 'llava-v1.6-34b.Q4_K_M.gguf',
    url: 'https://huggingface.co/cjpais/llava-v1.6-34B-gguf/resolve/main/llava-v1.6-34b.Q4_K_M.gguf?download=true',
    size: '20.7 GB',
    byteSize: 20700000000,
    name: 'Llava v1.6 (34b)',
    desc: 'Good balance of quality and resource usage.',
  },
  'nous-hermes-2-solar-10.7b.Q4_K_M.gguf': {
    localName: 'nous-hermes-2-solar-10.7b.Q4_K_M.gguf',
    url: 'https://huggingface.co/TheBloke/Nous-Hermes-2-SOLAR-10.7B-GGUF/resolve/main/nous-hermes-2-solar-10.7b.Q4_K_M.gguf?download=true',
    size: '6.46 GB',
    byteSize: 6460000000,
    name: 'Nous Hermes 2 (Solar 10.7b)',
    desc: 'Good balance of quality and resource usage.',
  },
};
