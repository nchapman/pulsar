import OpenAI from 'openai';

import { ChatMsg } from '@/db/chat';

const openai = new OpenAI({
  baseURL: 'http://127.0.0.1:52514/v1',
  apiKey: 'none',
  dangerouslyAllowBrowser: true,
});

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function getAIChatMessages(messages: ChatMsg[]): AIChatMessage[] {
  return messages
    .slice(-1)
    .map((msg) => ({ role: msg.isUser ? 'user' : 'assistant', content: msg.text }));
}

export async function stream(config: {
  messages: ChatMsg[];
  onStreamStart: () => void;
  onTextChunkReceived: (chunk: string) => void;
  onStreamEnd: () => void;
  onTitleUpdate: (title: string) => void;
}) {
  const { messages, onStreamStart, onTextChunkReceived, onTitleUpdate, onStreamEnd } = config;

  onStreamStart();

  const stream = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You are Pulsar, a friendly chatbot. You are helpful, kind, honest, good at writing, and never fails to answer any requests immediately and with precision.',
      },
      ...getAIChatMessages(messages),
    ],
    model: 'LLaMA_CPP',
    stream: true,
  });

  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of stream) {
    onTextChunkReceived(chunk.choices[0]?.delta?.content || '');
  }

  onStreamEnd();
  onTitleUpdate(messages[messages.length - 2].text);
}
