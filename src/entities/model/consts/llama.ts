import { createEvent, createStore } from 'effector';

import { isDev } from '@/shared/lib/func';

import { getModelPath } from '../lib/getModelPath.ts';
import { defaultModel } from './defaultModel.ts';
import Llamafile from './llamafile.ts';
import { AIModel } from './models.ts';

async function createLlama(model: AIModel) {
  const modelPath = isDev() ? `models/${model}` : await getModelPath(model);
  return new Llamafile(modelPath);
}

export const $llama = createStore<Llamafile | null>(null);
const setLlama = createEvent<Llamafile>();
$llama.on(setLlama, (_, payload) => payload);

createLlama(defaultModel).then(setLlama);
