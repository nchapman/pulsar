import { loge } from '@/shared/lib/Logger.ts';

import { getModelPath } from '../lib/getModelPath.ts';
import { NebulaModel } from '../nebula/NebulaModel.ts';

// eslint-disable-next-line import/no-mutable-exports
export let model: NebulaModel | null = null;

export async function loadModel(llmLocalName: string, mmpLocalName?: string) {
  try {
    const modelPath = await getModelPath(llmLocalName);
    const multiModalPath = mmpLocalName ? await getModelPath(mmpLocalName) : undefined;

    model = await NebulaModel.initModel(modelPath, multiModalPath);
  } catch (e) {
    loge('chatApi', `Failed to load model, rust error: ${e}`);
    throw e;
  }
}

export async function dropModel() {
  try {
    model?.drop();
    model = null;
  } catch (e: any) {
    loge('chatApi', `Failed to unload model ${e}`);
    throw e;
  }
}
