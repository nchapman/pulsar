import { ChatMsg } from '@/db/chat';
import { model } from '@/entities/model';
import { loge } from '@/shared/lib/Logger.ts';

import { urlToBase64 } from '../lib/utils/urlToBase64.ts';

export async function stream(
  config: {
    messages: ChatMsg[];
    onStreamStart: () => void;
    onTextChunkReceived: (chunk: string) => void;
    onStreamEnd: () => void;
    onTitleUpdate: (title: string) => void;
  },
  maxPredictLen: number = 10000
) {
  if (!model) {
    loge('chatApi', 'Model not loaded, cannot stream');
    return;
  }

  const { messages } = config;
  const { onStreamStart, onTextChunkReceived, onTitleUpdate, onStreamEnd } = config;

  try {
    const context = await model.createContext(
      messages.slice(0, -1).map((msg) => ({ message: msg.text, is_user: !!msg.isUser }))
    );

    context.onToken = (p) => {
      if (p.token !== null) onTextChunkReceived(p.token);
    };

    context.onComplete = onStreamEnd;

    const msg = messages[messages.length - 1];

    if (msg.file?.type === 'image') {
      const file = await urlToBase64(msg.file.src);
      await context.evaluateImage(file, messages[messages.length - 1].text);
    } else {
      await context.evaluateString(messages[messages.length - 1].text, true);
    }

    onStreamStart();

    await context.predict(maxPredictLen);
  } catch (e) {
    loge('chatApi', `Failed to stream: ${e}`);
  } finally {
    onStreamEnd();
    onTitleUpdate(messages[messages.length - 1].text);
  }
}
