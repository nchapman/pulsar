import { appWindow } from '@tauri-apps/api/window';
import { createEvent, createStore } from 'effector';

export const $isFullscreen = createStore(false);
const setIsFullscreen = createEvent<boolean>();
$isFullscreen.on(setIsFullscreen, (_, payload) => payload);

appWindow.onResized(() => {
  appWindow.isFullscreen().then(setIsFullscreen);
});
appWindow.isFullscreen().then(setIsFullscreen);
