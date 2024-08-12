import { createEvent, createStore } from 'effector';

export const $sidebarOpened = createStore(true);

export const toggleSidebar = createEvent();
export const closeSidebar = createEvent();
export const setSidebarOpen = createEvent<boolean>();

$sidebarOpened.on(toggleSidebar, (state) => !state);
$sidebarOpened.on(closeSidebar, () => false);
$sidebarOpened.on(setSidebarOpen, (_, opened) => opened);

export const $chatHistoryKey = createStore(0);
export const updateChatHistory = createEvent();
$chatHistoryKey.on(updateChatHistory, (key) => key + 1);
