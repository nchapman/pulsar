import { combine, createEffect, createEvent, createStore, sample } from 'effector';
import { Chat, ChatMsg } from '@/db/chat';
import { suid } from '@/shared/lib/func';
import { streamFx } from '../mocks/streamFx.ts';
import { assistantResponse } from '../mocks/assistantResponse.ts';
import { chatsRepository } from '@/db';

const NEW_CHAT_ID = 'new-chat';

export const switchChat = createEvent<Id>();
export const askQuestion = createEvent<string>();
const replaceChatData = createEvent<Chat>();
const streamEvent = {
  start: createEvent<{ msgId: Id }>(),
  finish: createEvent(),
  addTextChunk: createEvent<{ chunk: string; streamedMsgId: Id }>(),
};

export const $chatId = createStore<Id>(NEW_CHAT_ID);
$chatId.on(switchChat, (_, newChatId) => newChatId);

// Chat
const $chat = createStore<Chat | null>(null);
$chat.on(replaceChatData, (_, newChat) => newChat);

export const $streamedMsgId = createStore<Id | null>(null);
$streamedMsgId.on(streamEvent.start, (_, { msgId }) => msgId);
$streamedMsgId.reset(streamEvent.finish);

export const $msgMap = createStore<Record<Id, ChatMsg>>({});
export const $msgIdsList = createStore<Id[]>([]);

export const startNewChat = async () => {
  // skip if already new chat
  const chatId = $chatId.getState();
  if (chatId === NEW_CHAT_ID) return;

  const newChat: Chat = {
    id: 'tempId',
    messages: [],
    model: 'pulsar',
    title: 'New chat',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  switchChat(newChat.id);
  replaceChatData(newChat);
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

const createUserMsg = createEffect<{ text: string }, ChatMsg>(async ({ text }) => ({
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
    delay: 1,
  });
});

const askQuestionMiddleware = createEffect<{ isNew: boolean; text: string }, { text: string }>(
  async ({ isNew, text }) => {
    if (isNew) {
      const newChat = await chatsRepository.create({
        title: 'New chat',
        messages: [],
        model: 'pulsar',
      });

      switchChat(newChat.id);
      replaceChatData(newChat);
    }

    return { text };
  }
);

sample({
  source: {
    chatId: $chatId,
    streamedMsgId: $streamedMsgId,
  },
  clock: askQuestion,
  fn: ({ chatId }, text) => ({ text, isNew: chatId === NEW_CHAT_ID }),
  filter: ({ streamedMsgId }, text) => text.trim() !== '' && streamedMsgId === null,
  target: askQuestionMiddleware,
});

sample({
  clock: askQuestionMiddleware.doneData,
  fn: ({ text }) => ({ text }),
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

const updateDBChatMessages = createEffect<{ chatId: Id | null; newMessages: ChatMsg[] }, void>(
  async ({ chatId, newMessages }) => {
    if (!chatId || chatId === NEW_CHAT_ID) return;
    const updatedChat = await chatsRepository.update(chatId, { messages: newMessages });

    replaceChatData(updatedChat);
  }
);

// update DB on message
sample({
  source: {
    msgIdsList: $msgIdsList,
    msgMap: $msgMap,
    chatId: $chatId,
  },
  clock: [streamEvent.finish],
  fn: ({ msgIdsList, msgMap, chatId }) => {
    const newMessages = msgIdsList.map((id) => msgMap[id]);
    return { chatId, newMessages };
  },
  target: updateDBChatMessages,
});

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
