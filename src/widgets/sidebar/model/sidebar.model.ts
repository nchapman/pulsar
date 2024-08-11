import { createEvent, createStore } from 'effector';

export const $sidebarOpened = createStore(false);

export const toggleSidebar = createEvent();
export const closeSidebar = createEvent();
$sidebarOpened.on(toggleSidebar, (state) => !state);
$sidebarOpened.on(closeSidebar, () => false);

export const $chatHistoryKey = createStore(0);
export const updateChatHistory = createEvent();
$chatHistoryKey.on(updateChatHistory, (key) => key + 1);
