export const models = {
  'llava-v1.6-mistral': {
    localName: 'llava-v1.6-mistral-7b.Q5_K_M.gguf',
    url: 'https://huggingface.co/cjpais/llava-1.6-mistral-7b-gguf/resolve/main/llava-v1.6-mistral-7b.Q5_K_M.gguf',
    size: '5.13 GB',
    name: 'llava-v1.6-mistral',
    desc: 'Recommended small sized format. Good balance of quality, generation time, and resources usage.',
  },
};

export type AIModel = keyof typeof models;
