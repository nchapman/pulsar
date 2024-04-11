import { AIModelName } from '@/constants.ts';
import { ChatMsg } from '@/db/chat';
import { getModelPath } from '@/entities/model/lib/getModelPath.ts';
import { loge, logi } from '@/shared/lib/Logger.ts';

import { NebulaModel } from './model.ts';

let model: NebulaModel | null = null;

export async function loadModel(modelName: AIModelName) {
  try {
    const modelPath = await getModelPath(modelName);
    model = await NebulaModel.initModel(modelPath);
  } catch (e: any) {
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

export async function stream(
  config: {
    messages: ChatMsg[];
    onStreamStart: () => void;
    onTextChunkReceived: (chunk: string) => void;
    onStreamEnd: () => void;
    onTitleUpdate: (title: string) => void;
  },
  maxPredictLen: number = 100
) {
  logi('ChatAPI', 'Trying to stream!');
  if (!model) {
    loge('chatApi', 'Model not loaded, cannot stream');
    return;
  }

  const { messages, onStreamStart, onTextChunkReceived, onTitleUpdate, onStreamEnd } = config;

  try {
    const context = await model.createContext(
      messages.slice(0, -1).map((msg) => ({ message: msg.text, is_user: !!msg.isUser }))
    );

    context.onToken = (p) => {
      if (p.token != null) {
        onTextChunkReceived(p.token);
      }
    };
    context.onComplete = (_p) => {
      onStreamEnd();
    };

    await context.eval_string(messages[messages.length - 1].text, true);

    onStreamStart();

    await context.predict(maxPredictLen);
  } catch (e) {
    loge('chatApi', `Failed to stream: ${e}`);
  } finally {
    onStreamEnd();
    onTitleUpdate(messages[messages.length - 2].text);
  }
}

