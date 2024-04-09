import { fs } from '@tauri-apps/api';
import { createEvent, createStore } from 'effector';

import { getModelPath } from '../lib/getModelPath.ts';
import { defaultModel } from './defaultModel.ts';
import Llamafile from './llamafile.ts';
import { AIModel } from './models.ts';

async function createLlama(model: AIModel) {
  const modelPath = await getModelPath(model);

  if (!(await fs.exists(modelPath))) {
    throw new Error(`Model not found: ${modelPath}`);
  }

  return new Llamafile(modelPath);
}

export const $llama = createStore<Llamafile | null>(null);
const setLlama = createEvent<Llamafile>();

$llama.on(setLlama, (_, payload) => payload);

createLlama(defaultModel).then(setLlama).catch(console.warn);
