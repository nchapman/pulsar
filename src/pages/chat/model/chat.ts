import { createEvent, createStore } from 'effector';

export const $sidebarOpened = createStore(true);

export const toggleSidebar = createEvent();
$sidebarOpened.on(toggleSidebar, (state) => !state);
