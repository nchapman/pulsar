import { createEvent, createStore } from 'effector';

import { AIModel } from '@/entities/model';
import Llamafile from '@/llamafile.ts';
import { isDev } from '@/shared/lib/func';

import { getModelPath } from '../lib/getModelPath.ts';

async function createLlama() {
  const model: AIModel = 'llava-v1.6-mistral-7b';
  const modelPath = isDev() ? `models/${model}` : await getModelPath(model);
  return new Llamafile(modelPath);
}

export const $llama = createStore<Llamafile | null>(null);
const setLlama = createEvent<Llamafile>();
$llama.on(setLlama, (_, payload) => payload);

createLlama().then(setLlama);
