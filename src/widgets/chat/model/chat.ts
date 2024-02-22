import { combine, createEffect, createEvent, createStore, sample } from 'effector';
import { Chat, ChatMsg } from '@/db/chat';
import { suid } from '@/shared/lib/func';
import { streamFx } from '../mocks/streamFx.ts';
import { assistantResponse } from '../mocks/assistantResponse.ts';
import { chatsRepository } from '@/db';

export const switchChat = createEvent<Id>();

export const askQuestion = createEvent<string>();
const replaceChatData = createEvent<Chat>();

const streamEvent = {
  start: createEvent<{ msgId: Id }>(),
  finish: createEvent(),
  addTextChunk: createEvent<{ chunk: string; streamedMsgId: Id }>(),
};

export const $chatId = createStore<Id | null>(null).on(switchChat, (_, s) => s);
const $chat = createStore<Chat | null>(null).on(replaceChatData, (_, newChat) => newChat);

export const $streamedMsgId = createStore<Id | null>(null)
  .on(streamEvent.start, (_, { msgId }) => msgId)
  .reset(streamEvent.finish);

export const $msgMap = createStore<Record<Id, ChatMsg>>({});
export const $msgIdsList = createStore<Id[]>([]);

export const startNewChat = async () => {
  // skip if no messages for a chat
  const chatId = $chatId.getState();
  const msgList = $msgIdsList.getState();
  if (chatId && !msgList.length) return;

  try {
    const newChat = await chatsRepository.create({
      messages: [],
      model: 'pulsar',
      title: 'New chat',
    });

    switchChat(newChat.id);
    replaceChatData(newChat);
  } catch (err) {
    console.error(err);
  }
};

const getNewChatMessages = createEffect<Chat | null, ChatMsg[]>((chat) => {
  if (!chat) {
    throw new Error('missing chat');
  }

  return chat.messages;
});

export const $isFetchingMessages = getNewChatMessages.pending;

$msgIdsList.on(getNewChatMessages.doneData, (_, newMessages) => newMessages.map((msg) => msg.id));
$msgMap.on(getNewChatMessages.doneData, (_, newMessages) =>
  newMessages.reduce((acc, msg) => ({ ...acc, [msg.id]: msg }), {})
);

// get messages on chatId change
sample({
  source: $chat,
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

const streamMsg = createEffect<Id, void>(async (msgId) => {
  streamFx({
    text: assistantResponse,
    onTextChunkReceived: (chunk) => streamEvent.addTextChunk({ chunk, streamedMsgId: msgId }),
    onStreamStart: () => streamEvent.start({ msgId }),
    onStreamEnd: streamEvent.finish,
    delay: 50,
  });
});

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

$msgMap.on(streamEvent.addTextChunk, (state, { streamedMsgId, chunk }) => ({
  ...state,
  [streamedMsgId]: {
    ...state[streamedMsgId],
    text: state[streamedMsgId].text + chunk,
  },
}));

// Auxiliary
export const $isInputDisabled = combine(
  $isFetchingMessages,
  $streamedMsgId,
  (fetching, streamedMsgId) => fetching || !!streamedMsgId
);
