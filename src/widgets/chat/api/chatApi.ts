import { AIModelName } from '@/constants.ts';
import { ChatMsg } from '@/db/chat';
import { getModelPath } from '@/entities/model/lib/getModelPath.ts';

import { NebulaModel } from './model.ts';

let model: NebulaModel | null = null;

export async function loadModel(modelName: AIModelName) {
  try {
    const modelPath = await getModelPath(modelName);
    model = await NebulaModel.init_model(modelPath);
  } catch (e) {
    console.error('Failed to load model', e);
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
  const { messages, onStreamStart, onTextChunkReceived, onTitleUpdate, onStreamEnd } = config;

  const context = await model?.create_context(
    messages.slice(0, -1).map((msg) => ({ message: msg.text, is_user: msg.isUser ? true : false }))
  );

  if (!context) {
    console.warn('Model not initialized');
    return;
  }

  context.onToken = (p) => {
    if (p.token != null) {
      onTextChunkReceived(p.token);
    } else {
      console.warn('received null token from model');
    }
  };
  context.onComplete = (_p) => {
    onStreamEnd();
  };

  // eslint-disable-next-line no-restricted-syntax
  await context.eval_string(messages[messages.length - 1].text, true);

  onStreamStart();

  await context.predict(maxPredictLen);

  onStreamEnd();
  onTitleUpdate(messages[messages.length - 2].text);
}
