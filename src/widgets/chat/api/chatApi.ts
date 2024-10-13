import { ChatMsg } from '@/db/chat';
import { modelManager } from '@/entities/model';
import { loge } from '@/shared/lib/func';

export async function stream(
  config: {
    messages: ChatMsg[];
    onStreamStart: () => void;
    onTextChunkReceived: (chunk: string) => void;
    onStreamEnd: () => void;
    onTitleUpdate: (title: string) => void;
  },
  ctx: { maxPredictLen: number; temp: number; topP: number; stopTokens: string[] }
) {
  if (!modelManager.model) {
    loge('chatApi', 'Model not loaded, cannot stream');
    return;
  }

  const { messages } = config;
  const { onStreamStart, onTextChunkReceived, onTitleUpdate, onStreamEnd } = config;

  try {
    const context = await modelManager.model.createContext(
      []
      //      messages.slice(0, -1).map((msg) => ({ message: msg.text, is_user: !!msg.isUser })),
    );

    context.onToken = (p) => {
      if (p.token !== null) onTextChunkReceived(p.token);
    };

    context.onComplete = onStreamEnd;

    await context.evaluate(messages);

    onStreamStart();

    await context.predict({
      maxLength: ctx.maxPredictLen || 10000,
      topP: ctx.topP,
      temp: ctx.temp,
    });
  } catch (e) {
    loge('chatApi', `Failed to stream: ${e}`);
  } finally {
    onStreamEnd();
    onTitleUpdate(messages[messages.length - 1].text);
  }
}
