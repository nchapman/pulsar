import { LlmName, supportedLlms } from '@/entities/model/consts/supported-llms.const.ts';
import { loge } from '@/shared/lib/Logger.ts';

import { getModelPath } from '../lib/getModelPath.ts';
import { NebulaModel } from '../nebula/NebulaModel.ts';

// eslint-disable-next-line import/no-mutable-exports
export let model: NebulaModel | null = null;

export async function loadModel(llmName: LlmName) {
  try {
    const { localName, mmp } = supportedLlms[llmName];
    const modelPath = await getModelPath(localName);
    const multiModalPath = await getModelPath(mmp!.localName);

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