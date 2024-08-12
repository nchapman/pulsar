import { createEvent, createStore } from 'effector';

export const $modelSettingsOpened = createStore(false);

export const openModelSettings = createEvent();
export const closeModelSettings = createEvent();
export const toggleModelSettings = createEvent();
export const setModelSettingsOpen = createEvent<boolean>();

$modelSettingsOpened.on(toggleModelSettings, (state) => !state);
$modelSettingsOpened.on(closeModelSettings, () => false);
$modelSettingsOpened.on(openModelSettings, () => true);
$modelSettingsOpened.on(setModelSettingsOpen, (_, opened) => opened);

// Keep only 1 panel opened at a time
// sample({
//   clock: $sidebarOpened,
//   target: setModelSettingsOpen,
//   fn: (opened) => !opened,
//   filter: (opened) => opened,
// });
//
// sample({
//   clock: $modelSettingsOpened,
//   target: setSidebarOpen,
//   fn: (opened) => !opened,
// });
