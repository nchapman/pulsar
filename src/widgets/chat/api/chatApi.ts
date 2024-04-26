import { ChatMsg } from '@/db/chat';
import { model } from '@/entities/model';
import { dataURLtoFile } from '@/features/upload-file';
import { loge } from '@/shared/lib/Logger.ts';

import { catImg } from '../mocks/sampleImage.ts';

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

    // test reading a file and sending it to the model
    const file = dataURLtoFile(catImg, 'cat.png');

    await context.evaluateImage(file, messages[messages.length - 1].text);
    // await context.evaluateString(messages[messages.length - 1].text, true);

    onStreamStart();

    await context.predict(maxPredictLen);
  } catch (e) {
    loge('chatApi', `Failed to stream: ${e}`);
  } finally {
    onStreamEnd();
    onTitleUpdate(messages[messages.length - 1].text);
  }
}
