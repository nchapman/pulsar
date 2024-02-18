import { combine, createEffect, createEvent, createStore, sample } from 'effector';
import { ChatMsg } from '../types/ChatMsg';
import { mockPromise, suid } from '@/shared/lib/func';
import { mockMessages, mockMessages2 } from '../mocks/chat-messages.ts';
import { streamFx } from '../mocks/streamFx.ts';
import { assistantResponse } from '../mocks/assistantResponse.ts';

export const switchChat = createEvent<Id>();
export const askQuestion = createEvent<string>();

const $chatId = createStore<Id | null>(null).on(switchChat, (_, chatId) => chatId);

export const $streamedMsgId = createStore<Id | null>(null);

// Create msg: question + id = add to item to map, push id to list

export const $msgMap = createStore<Record<Id, ChatMsg>>({});
export const $msgIdsList = createStore<Id[]>([]);

const getNewChatMessages = createEffect<Id | null, ChatMsg[]>((chatId) =>
  // TODO
  mockPromise(500, chatId === '1' ? mockMessages : mockMessages2)
);

export const $isFetchingMessages = getNewChatMessages.pending;

$msgIdsList.on(getNewChatMessages.doneData, (_, newMessages) => newMessages.map((msg) => msg.id));
$msgMap.on(getNewChatMessages.doneData, (_, newMessages) =>
  newMessages.reduce((acc, msg) => ({ ...acc, [msg.id]: msg }), {})
);

// get messages on chatId change
sample({
  source: $chatId,
  filter: (chatId) => chatId !== null,
  clock: $chatId,
  target: getNewChatMessages,
});

// On ask question: createMsg => setStreamedMsg => updateMsgMap

const createUserMsg = createEffect<{ text: string }, ChatMsg>(({ text }) => ({
  text,
  isUser: true,
  id: suid(),
  user: { name: 'User' },
}));

const createAssistantMsg = createEffect<ChatMsg, ChatMsg>((userMessage) => ({
  text: '',
  isUser: false,
  id: suid(),
  assistant: { userMsgId: userMessage.id },
}));

// Streaming
// const getStreamedMsgChunk = createEvent<string>();
const addTextChunkToMsg = createEvent<{ chunk: string; streamedMsgId: Id }>();

const streamMsg = createEffect<Id, void>(async (msgId) => {
  streamFx({
    text: assistantResponse,
    onTextChunkReceived: (chunk) => addTextChunkToMsg({ chunk, streamedMsgId: msgId }),
    onStreamStart: () => {},
    onStreamEnd: () => {},
    delay: 500,
  });
});

export const $isStreamingResponse = streamMsg.pending;

sample({
  source: $streamedMsgId,
  filter: (streamedMsgId, text) => text !== '' && streamedMsgId === null,
  clock: askQuestion,
  fn: (_, text) => ({ text }),
  target: createUserMsg,
});

$msgMap.on([createUserMsg.doneData, createAssistantMsg.doneData], (state, msg) => ({
  ...state,
  [msg.id]: msg,
}));
$msgIdsList.on([createUserMsg.doneData, createAssistantMsg.doneData], (state, msg) => [
  ...state,
  msg.id,
]);

sample({
  clock: createUserMsg.done,
  fn: ({ result }) => result,
  target: createAssistantMsg,
});

sample({
  clock: createAssistantMsg.doneData,
  fn: (msg) => msg.id,
  target: streamMsg,
});

// sample({
//   source: $streamedMsgId,
//   clock: getStreamedMsgChunk,
//   fn: (streamedMsgId, chunk) => ({ streamedMsgId, chunk }),
//   target: addTextChunkToMsg,
// });

$msgMap.on(addTextChunkToMsg, (state, { streamedMsgId, chunk }) => ({
  ...state,
  [streamedMsgId]: {
    ...state[streamedMsgId],
    text: state[streamedMsgId].text + chunk,
  },
}));

// $msgMap.watch(console.log);

// Auxiliary
export const $isInputDisabled = combine(
  $isFetchingMessages,
  $isStreamingResponse,
  (fetching, streaming) => fetching || streaming
);
