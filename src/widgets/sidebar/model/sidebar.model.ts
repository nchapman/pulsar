import { createEvent, createStore } from 'effector';

export const $sidebarOpened = createStore(true);

export const toggleSidebar = createEvent();
$sidebarOpened.on(toggleSidebar, (state) => !state);

export const $chatHistoryKey = createStore(0);
export const updateChatHistory = createEvent();
$chatHistoryKey.on(updateChatHistory, (key) => key + 1);
