export const models = {
  'llava-v1.6-mistral-7b': {
    localName: 'llava-v1.6-mistral-7b.Q4_K_M.gguf',
    url: 'https://huggingface.co/cjpais/llava-1.6-mistral-7b-gguf/resolve/main/llava-v1.6-mistral-7b.Q4_K_M.gguf?download=true',
    size: '4.37 GB',
    name: 'llava-v1.6-mistral-7b',
    desc: 'Recommended small sized format. Good balance of quality, generation time, and resources usage.',
  },
  'llava-v1.6-34b': {
    localName: 'llava-v1.6-34b.Q4_K_M.gguf',
    url: 'https://huggingface.co/cjpais/llava-v1.6-34B-gguf/resolve/main/llava-v1.6-34b.Q4_K_M.gguf?download=true',
    size: '20.7 GB',
    name: 'llava-v1.6-34b',
    desc: 'Recommended large sized format. Good balance of quality, generation time, and resources usage.',
  },
  'nous-hermes-2-solar-10.7b': {
    localName: 'nous-hermes-2-solar-10.7b.Q4_K_M.gguf',
    url: 'https://huggingface.co/TheBloke/Nous-Hermes-2-SOLAR-10.7B-GGUF/resolve/main/nous-hermes-2-solar-10.7b.Q4_K_M.gguf?download=true',
    size: '6.46 GB',
    name: 'nous-hermes-2-solar',
    desc: 'Recommended mid sized format. Good balance of quality, generation time, and resources usage.',
  },
};

export type AIModel = keyof typeof models;
