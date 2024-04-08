import { invoke } from '@tauri-apps/api';
import { combine, createEffect, createEvent, createStore, sample } from 'effector';

import { chatsRepository } from '@/db';
import type { Chat, ChatMsg } from '@/db/chat';
import { suid } from '@/shared/lib/func';

import { stream } from '../api/chatApi.ts';

const chatEvt = {
  setChatId: createEvent<Id>(),
  switch: createEvent<Id>(),
  startNew: createEvent(),
  askQuestion: createEvent<string>(),
  replaceData: createEvent<Chat>(),
};

const streamEvt = {
  start: createEvent<{ msgId: Id }>(),
  finish: createEvent(),
  addTextChunk: createEvent<{ msgId: Id; chunk: string }>(),
  updateTitle: createEvent<{ title: string; chatId: Id }>(),
};

export const $chat = {
  id: createStore<Id | null>(null),
  data: createStore<Chat | null>(null),
};

// Change chatId on switchChat
$chat.id.on(chatEvt.switch, (_, newChatId) => newChatId);
$chat.id.on(chatEvt.setChatId, (_, newChatId) => newChatId);

// Replace chat data on replaceChatData
$chat.data.on(chatEvt.replaceData, (_, newChat) => newChat);

export const $streamedMsgId = createStore<Id | null>(null);
$streamedMsgId.on(streamEvt.start, (_, { msgId }) => msgId);
$streamedMsgId.reset(streamEvt.finish);

export const $messages = {
  data: createStore<Record<Id, ChatMsg>>({}),
  idsList: createStore<Id[]>([]),
};

// Reset chat on startNewChat
$chat.id.reset(chatEvt.startNew);
$chat.data.reset(chatEvt.startNew);
$messages.data.reset(chatEvt.startNew);
$messages.idsList.reset(chatEvt.startNew);

const NEW_CHAT_TITLE = 'New chat';

async function createDBChat() {
  const newChat = await chatsRepository.create({
    title: NEW_CHAT_TITLE,
    messages: [],
    model: 'pulsar',
  });

  chatEvt.setChatId(newChat.id);
  chatEvt.replaceData(newChat);
}

const fetchDbChatWithMessages = createEffect<{ chatId: Id | null }, ChatMsg[]>(
  async ({ chatId }) => {
    invoke('plugin:nebula|do_something');
    if (!chatId) return [];

    const chat = await chatsRepository.getById(chatId);
    chatEvt.replaceData(chat);

    return chat.messages;
  }
);

export const $isFetchingMessages = fetchDbChatWithMessages.pending;

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
  assistant: { userMsgId: userMessage.id, input: userMessage.text },
}));

const streamMsg = createEffect<{ chatId: Id; msgId: Id; messages: ChatMsg[] }, void>(
  async ({ msgId, chatId, messages }) => {
    stream({
      messages: messages.map((msg) => msg.text),
      onTextChunkReceived: (chunk) => streamEvt.addTextChunk({ chunk, msgId }),
      onStreamStart: () => streamEvt.start({ msgId }),
      onTitleUpdate: (title) => streamEvt.updateTitle({ title, chatId }),
      onStreamEnd: streamEvt.finish,
    });
  }
);

const askQuestionMiddleware = createEffect<{ isNew: boolean; text: string }, { text: string }>(
  async ({ isNew, text }) => {
    if (isNew) await createDBChat();

    return { text };
  }
);

const updateDBChatMessages = createEffect<{ chatId: Id | null; newMessages: ChatMsg[] }, void>(
  async ({ chatId, newMessages }) => {
    if (!chatId) return;
    const updatedChat = await chatsRepository.update(chatId, { messages: newMessages });

    chatEvt.replaceData(updatedChat);
  }
);

const updateDBChatTitle = createEffect<{ title: string; chatId: Id }, void>(
  async ({ chatId, title }) => {
    if (!chatId) return;
    const updatedChat = await chatsRepository.update(chatId, { title });
    chatEvt.replaceData(updatedChat);
  }
);

// add new messages to store on chat switch
$messages.data.on(fetchDbChatWithMessages.doneData, (_, newMessages) =>
  newMessages.reduce((acc, msg) => ({ ...acc, [msg.id]: msg }), {})
);
$messages.idsList.on(fetchDbChatWithMessages.doneData, (_, newMessages) =>
  newMessages.map((msg) => msg.id)
);

// add new messages to store on user/assistant message creation
$messages.data.on([createUserMsg.doneData, createAssistantMsg.doneData], (state, msg) => ({
  ...state,
  [msg.id]: msg,
}));

$messages.idsList.on([createUserMsg.doneData, createAssistantMsg.doneData], (state, msg) => [
  ...state,
  msg.id,
]);

sample({
  source: $chat.data,
  clock: streamEvt.updateTitle,
  target: updateDBChatTitle,
  fn: (_, data) => data,
  filter: (chat) => chat?.title === NEW_CHAT_TITLE,
});

// get messages on chatId change
sample({
  source: $chat.data,
  filter: (_, chatId) => chatId !== null,
  fn: (_, chatId) => ({ chatId }),
  clock: chatEvt.switch,
  target: fetchDbChatWithMessages,
});

// on askQuestion init askQuestionMiddleware
sample({
  source: {
    chatId: $chat.id,
    streamedMsgId: $streamedMsgId,
  },
  clock: chatEvt.askQuestion,
  fn: ({ chatId }, text) => ({ text, isNew: !chatId }),
  filter: ({ streamedMsgId }, text) => text.trim() !== '' && streamedMsgId === null,
  target: askQuestionMiddleware,
});

// create user message on askQuestionMiddleware done
sample({
  clock: askQuestionMiddleware.doneData,
  fn: ({ text }) => ({ text }),
  target: createUserMsg,
});

// update db chat on assistant response
sample({
  source: {
    msgIdsList: $messages.idsList,
    msgMap: $messages.data,
    chatId: $chat.id,
  },
  clock: [streamEvt.finish],
  fn: ({ msgIdsList, msgMap, chatId }) => {
    const newMessages = msgIdsList.map((id) => msgMap[id]);
    return { chatId, newMessages };
  },
  target: updateDBChatMessages,
});

// create assistant message on user message
sample({
  clock: createUserMsg.done,
  fn: ({ result }) => result,
  target: createAssistantMsg,
});

// start stream on assistant message creation
sample({
  source: {
    chatId: $chat.id,
    msgIds: $messages.idsList,
    msgsData: $messages.data,
  },
  clock: createAssistantMsg.doneData,
  fn: ({ chatId, msgIds, msgsData }, msg) => ({
    msgId: msg.id,
    chatId: chatId!,
    messages: msgIds.map((id) => msgsData[id]),
  }),
  target: streamMsg,
});

// change msg data on stream events
$messages.data.on(streamEvt.addTextChunk, (state, { msgId, chunk }) => ({
  ...state,
  [msgId]: {
    ...state[msgId],
    text: state[msgId].text + chunk,
  },
}));

// UI Auxiliary
export const $isInputDisabled = combine($isFetchingMessages, (fetching) => fetching);

export const $streamedText = combine($streamedMsgId, $messages.data, (msgId, data) => {
  const msg = data[msgId!];
  return msg?.text || '';
});

export const { askQuestion, startNew: startNewChat, switch: switchChat } = chatEvt;

createUserMsg.fail.watch((a) => console.log('askQuestion', a));

