import { createEvent, createStore } from 'effector';

export const $chatHistoryKey = createStore(0);
export const updateChatHistory = createEvent();
$chatHistoryKey.on(updateChatHistory, (key) => key + 1);
