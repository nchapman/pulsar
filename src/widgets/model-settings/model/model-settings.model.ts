import { createEvent, createStore, sample } from 'effector';

import { $currRoute, Route } from '@/app/routes';

export const $modelSettingsOpened = createStore(false);

export const openModelSettings = createEvent();
export const closeModelSettings = createEvent();
export const toggleModelSettings = createEvent();
export const setModelSettingsOpen = createEvent<boolean>();

$modelSettingsOpened.on(toggleModelSettings, (state) => !state);
$modelSettingsOpened.on(closeModelSettings, () => false);
$modelSettingsOpened.on(openModelSettings, () => true);
$modelSettingsOpened.on(setModelSettingsOpen, (_, opened) => opened);

sample({
  clock: $currRoute,
  target: closeModelSettings,
  filter: (val) => val !== Route.Chat,
});

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
