import { fs } from '@tauri-apps/api';

import { ChatMsg } from '@/db/chat';
import { defaultModel } from '@/entities/model/index.ts';
import { getModelPath } from '@/entities/model/lib/getModelPath.ts';

import { NebulaModel } from './model.ts';

const modelPath = await getModelPath(defaultModel);
console.warn('Checking model at path:', modelPath);
const modelExists = await fs.exists(modelPath);

// TODO do not use hardcoded paths
const model = modelExists ? await NebulaModel.init_model(modelPath) : null;

// const openai = new OpenAI({
//   baseURL: 'http://127.0.0.1:52514/v1',
//   apiKey: 'none',
//   dangerouslyAllowBrowser: true,
// });
//
// export interface AIChatMessage {
//   role: 'user' | 'assistant';
//   content: string;
// }
//
// function getAIChatMessages(messages: ChatMsg[]): AIChatMessage[] {
//   return messages
//     .slice(0, -1)
//     .map((msg) => ({ role: msg.isUser ? 'user' : 'assistant', content: msg.text }));
// }
//

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

  const context = await model?.create_context();

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
  for (const m of messages) {
    await context.eval_string(m.text, true);
  }

  onStreamStart();

  await context.predict(maxPredictLen);

  onStreamEnd();
  onTitleUpdate(messages[messages.length - 2].text);
}

