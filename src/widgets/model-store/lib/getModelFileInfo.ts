import {
  fetchHuggingFaceFiles,
  searchHuggingFaceModels,
} from '@/widgets/model-store/api/search-hugging-face.ts';

export async function getModelFileInfo(modelName: string, fileName: string) {
  const [modelData] = await searchHuggingFaceModels({ query: modelName });
  if (!modelData) throw new Error('Model not found');

  const files = await fetchHuggingFaceFiles(modelData.name);
  const fileData = files.find((i) => i.name === fileName);
  if (!fileData) throw new Error('File not found');

  return { modelData, fileData, files };
}
