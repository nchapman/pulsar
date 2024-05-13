export type HuggingFaceSearchModelResponse = {
  id: string;
  likes: number;
  private: boolean;
  downloads: number;
  tags: string[];
  pipeline_tag: string;
  created_at: string;
  modelId: string;
};

export type HuggingFaceModel = {
  id: string;
  modelId: string;
  author: string;
  sha: string;
  lastModified: string;
  private: boolean;
  disabled: boolean;
  gated: boolean;
  pipeline_tag: string;
  tags: string[];
  downloads: number;
  likes: number;
  cardData: {
    license: string;
    tags: string[];
    pipeline_tag: string;
  };
  siblings: {
    rfilename: string;
  };
  createdAt: string;
};

const HUGGING_FACE_BASE_URL = 'https://huggingface.co';
const HUGGING_FACE_API_URL = `${HUGGING_FACE_BASE_URL}/api`;

export const searchHuggingFaceModel = async (
  query: string
): Promise<HuggingFaceSearchModelResponse[]> => {
  const q = query.trim();

  const response = await fetch(`${HUGGING_FACE_API_URL}/models?search=${encodeURIComponent(q)}`);
  return response.json();
};

export const fetchHuggingFaceModel = async (modelId: string): Promise<HuggingFaceModel> => {
  const response = await fetch(`${HUGGING_FACE_API_URL}/models/${modelId}`);
  return response.json();
};

export const getHuggingFaceDownloadLink = (modelId: string, file: string): string =>
  // https://huggingface.co/cjpais/llava-1.6-mistral-7b-gguf/resolve/main/llava-v1.6-mistral-7b.Q4_K_M.gguf?download=true
  `${HUGGING_FACE_BASE_URL}/${modelId}/resolve/main/${file}?download=true`;

