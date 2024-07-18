interface CuratedModel {
  modelName: string;
  fileName: string;
  description: string;
  logo: string;
}

export const curatedModels: CuratedModel[] = [
  {
    modelName: 'cjpais/llava-1.6-mistral-7b-gguf',
    fileName: 'llava-v1.6-mistral-7b.Q3_K_XS.gguf',
    description:
      'The primary intended users of the model are researchers and hobbyists in computer vision, natural language processing, machine learning, and artificial intelligence.',
    logo: '',
  },
  {
    modelName: 'Mozilla/llava-v1.5-7b-llamafile',
    fileName: 'llava-v1.5-7b-Q4_K.gguf',
    description:
      'LLM Compiler is intended for commercial and research use in English, relevant programming languages, LLVM IR, x86_64 assembly and ARM assembly.',
    logo: '',
  },
  {
    modelName: 'TheBloke/OpenHermes-2.5-Mistral-7B-GGUF',
    fileName: 'openhermes-2.5-mistral-7b.Q4_0.gguf',
    description:
      'The primary intended users of the model are researchers and hobbyists in computer vision, natural language processing, machine learning, and artificial intelligence.',
    logo: '',
  },
];
