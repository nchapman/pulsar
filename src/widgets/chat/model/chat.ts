import { combine, createEffect, createEvent, createStore, sample } from 'effector';
import { ChatMsg } from '../types/ChatMsg';
import { mockPromise } from '@/shared/lib/func';
import { mockMessages, mockMessages2 } from '@/widgets/chat/mocks/chat-messages.ts';

export const switchChat = createEvent<Id>();
export const askQuestion = createEvent<string>();

const $chatId = createStore<Id | null>(null).on(switchChat, (_, chatId) => chatId);

export const $msgMap = createStore<Record<Id, ChatMsg>>({}).reset(switchChat);
export const $msgIdsList = createStore<Id[]>([]).reset(switchChat);

const getNewChatMessages = createEffect<Id | null, ChatMsg[]>((chatId) =>
  // TODO
  mockPromise(500, chatId === '1' ? mockMessages : mockMessages2)
);

// On ask question: createMsg => setStreamedMsg => updateMsgMap

export const $streamedMsgId = createStore<Id | null>(null);

export const $isFetchingMessages = getNewChatMessages.pending;
export const $isStreamingResponse = createStore(false).on(askQuestion, () => true);

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

// export const chatActions = createApi($messages, {
//   add: (items, newMsg) => [...items, newMsg],
// });

// Auxiliary
export const $isInputDisabled = combine(
  $isFetchingMessages,
  $isStreamingResponse,
  (fetching, streaming) => fetching || streaming
);
