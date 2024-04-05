import NebulaModel from './model.ts';
import ContextModel from './context.ts';

//import { ChatMsg } from '@/db/chat';

const model = await NebulaModel.init_model(
  './models/llava-v1.6-mistral-7b.Q4_K_M.gguf'
);

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

export async function stream(config: {
  messages: string[];
  onStreamStart: () => void;
  onTextChunkReceived: (chunk: string) => void;
  onStreamEnd: () => void;
  onTitleUpdate: (title: string) => void;
},
max_predict_len: i32 = 100) {
  const { messages, onStreamStart, onTextChunkReceived, onTitleUpdate, onStreamEnd } = config;

  const context = await model.create_context();
  context.onToken = (p) => {
    onTextChunkReceived(p.token);
  };
  context.onComplete = (p) => {
    onStreamEnd();
  };
  for m in messages{
    await context.eval_string(messages, true);
  }
  onStreamStart();

  await context.predict(max_predict_len);

  // const stream = await openai.chat.completions.create({
  //   messages: [
  //     {
  //       role: 'system',
  //       content:
  //         'You are Pulsar, a friendly chatbot. You are helpful, kind, honest, good at writing, and never fails to answer any requests immediately and with precision.',
  //     },
  //     ...getAIChatMessages(messages),
  //   ],
  //   model: 'LLaMA_CPP',
  //   stream: true,
  // });
  //
  // eslint-disable-next-line no-restricted-syntax

  // for await (const chunk of stream) {
  //   onTextChunkReceived(chunk.choices[0]?.delta?.content || '');
  // }
  //
  onStreamEnd();
  onTitleUpdate(messages[messages.length - 2].text);
}
