import { combine, createEffect, createEvent, createStore, sample } from 'effector';

import { goToChat } from '@/app/routes';
import { chatsRepository } from '@/db';
import type { Chat, ChatMsg } from '@/db/chat';
import { ModelSettings } from '@/db/chat/chat.repository.ts';
import { modelManager } from '@/entities/model';
import { FileData } from '@/features/upload-file';
import { suid } from '@/shared/lib/func';

import { stream } from '../api/chatApi.ts';
import { defaultModelSettings } from '../consts/defaultModelSettings';

const chatEvt = {
  setChatId: createEvent<Id>(),
  switch: createEvent<Id>(),
  startNew: createEvent(),
  askQuestion: createEvent<{ text: string; file?: FileData }>(),
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
  tempModelSettings: createStore<ModelSettings>(defaultModelSettings),
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
  if (!modelManager.currentModel) return;

  const newChat = await chatsRepository.create({
    title: NEW_CHAT_TITLE,
    messages: [],
    model: modelManager.currentModel,
    isArchived: false,
    isPinned: false,
    modelSettings: $chat.tempModelSettings.getState(),
  });

  chatEvt.setChatId(newChat.id);
  chatEvt.replaceData(newChat);
}

const fetchDbChatWithMessages = createEffect<{ chatId: Id | null }, ChatMsg[]>(
  async ({ chatId }) => {
    if (!chatId) return [];

    const chat = await chatsRepository.getById(chatId);
    chatEvt.replaceData(chat);

    return chat.messages;
  }
);

export const $isFetchingMessages = fetchDbChatWithMessages.pending;

const createUserMsg = createEffect<{ text: string; file?: FileData }, ChatMsg>(
  async ({ text, file }) => ({
    text,
    file,
    isUser: true,
    id: suid(),
    user: { name: 'User' },
  })
);

const createAssistantMsg = createEffect<ChatMsg, ChatMsg>((userMessage) => ({
  text: '',
  isUser: false,
  id: suid(),
  assistant: { userMsgId: userMessage.id, input: userMessage.text },
}));

const streamMsg = createEffect<{ chatId: Id; msgId: Id; messages: ChatMsg[] }, void>(
  async ({ msgId, chatId, messages }) => {
    const chatSettings = $chat.data.getState()?.modelSettings || defaultModelSettings;

    stream(
      {
        messages: messages.slice(0, -1).map((msg) => msg),
        onTextChunkReceived: (chunk) => streamEvt.addTextChunk({ chunk, msgId }),
        onStreamStart: () => streamEvt.start({ msgId }),
        onTitleUpdate: (title) => streamEvt.updateTitle({ title, chatId }),
        onStreamEnd: streamEvt.finish,
      },
      {
        topP: chatSettings.topP,
        temp: chatSettings.temp,
        maxPredictLen: chatSettings.maxLength,
        stopTokens: chatSettings.stopTokens,
      }
    );
  }
);

const askQuestionMiddleware = createEffect<
  { isNew: boolean; text: string; file?: FileData },
  { text: string; file?: FileData }
>(async ({ isNew, ...rest }) => {
  if (isNew) await createDBChat();

  return rest;
});

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

export const regenerateAnswer = createEvent<Id>();

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
  fn: ({ chatId }, { text, file }) => ({ text, isNew: !chatId, file }),
  filter: ({ streamedMsgId }, { text }) => text.trim() !== '' && streamedMsgId === null,
  target: askQuestionMiddleware,
});

// create user message on askQuestionMiddleware done
sample({
  clock: askQuestionMiddleware.doneData,
  fn: ({ text, file }) => ({ text, file }),
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

// Regenerate massage
sample({
  source: {
    chatId: $chat.id,
    msgIds: $messages.idsList,
    msgData: $messages.data,
  },
  clock: regenerateAnswer,
  fn: ({ chatId, msgIds, msgData }, msgId) => ({
    msgId,
    chatId: chatId!,
    messages: msgIds.map((id) => msgData[id]),
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

// reset msg text on regenerate
$messages.data.on(regenerateAnswer, (state, msgId) => ({
  ...state,
  [msgId]: {
    ...state[msgId],
    text: '',
  },
}));

// UI Auxiliary
export const $isInputDisabled = combine($isFetchingMessages, (fetching) => fetching);

export const $streamedText = combine($streamedMsgId, $messages.data, (msgId, data) => {
  const msg = data[msgId!];
  return msg?.text || '';
});

export const isArchivedChat = $chat.data.map((i) => i?.isArchived, { skipVoid: false });

export const { askQuestion, startNew: startNewChat, switch: switchChat } = chatEvt;

// start new chat on model change
sample({
  clock: modelManager.state.$currentModel,
  target: startNewChat,
});

// switch model on chat switch
sample({
  clock: $chat.id,
  source: $chat.data,
  fn: (chat) => modelManager.switchModel(chat!.model),
  filter: (chat) => chat !== null,
});

switchChat.watch(goToChat);
startNewChat.watch(goToChat);

// model settings
export const $modelSettings = combine(
  $chat.data,
  $chat.tempModelSettings,
  (chat, tempSettings) => chat?.modelSettings || tempSettings
);

export const setModelSettings = createEvent<Partial<ModelSettings>>();
export const resetModelSettings = setModelSettings.prepend(() => defaultModelSettings);
export const $modelSettingsDisabled = createStore(true);

const setModelSettingsDisabled = createEvent<boolean>();
$modelSettingsDisabled.on(setModelSettings, () => false);
$modelSettingsDisabled.on(setModelSettingsDisabled, (_, val) => val);

function validateModelSettings(settings: ModelSettings) {
  const { temp, topP, maxLength } = settings;

  if (Number.isNaN(topP) || topP < 0 || topP > 1) {
    throw new Error('Top P value should be between 0 and 1');
  }

  if (Number.isNaN(temp) || temp < 0 || temp > 2) {
    throw new Error('Temperature value should be between 0 and 1');
  }

  if (Number.isNaN(maxLength) || maxLength < 0) {
    throw new Error('Max length value should be greater than 0');
  }
}

export async function saveModelSettingsForChat() {
  const chatData = $chat.data.getState();
  setModelSettingsDisabled(true);

  if (!chatData || !chatData.modelSettings) return;
  validateModelSettings(chatData.modelSettings);

  await chatsRepository.update(chatData.id, { modelSettings: chatData.modelSettings });
}

$chat.data.on(setModelSettings, (chat, settings) => {
  if (!chat) return chat;

  const newSettings = {
    ...(chat.modelSettings || defaultModelSettings),
    ...settings,
  };

  return {
    ...chat,
    modelSettings: newSettings,
  } as Chat;
});

// set temp settings if new chat
sample({
  source: { chat: $chat.data, tempSettings: $chat.tempModelSettings },
  clock: setModelSettings,
  target: $chat.tempModelSettings,
  fn: ({ tempSettings }, settings) => ({ ...tempSettings, ...settings }),
  filter: ({ chat }) => !chat,
});

$chat.tempModelSettings.reset(startNewChat);
