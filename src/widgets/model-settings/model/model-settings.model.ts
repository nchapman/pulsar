import { createEvent, createStore, sample } from 'effector';

import { $sidebarOpened, closeSidebar } from '@/widgets/sidebar';

export const $modelSettingsOpened = createStore(true);

export const openModelSettings = createEvent();
export const closeModelSettings = createEvent();
export const toggleModelSettings = createEvent();

$modelSettingsOpened.on(toggleModelSettings, (state) => !state);
$modelSettingsOpened.on(closeModelSettings, () => false);
$modelSettingsOpened.on(openModelSettings, () => true);

// Keep only 1 panel opened at a time
sample({
  clock: $sidebarOpened,
  target: closeModelSettings,
  filter: (opened) => opened,
});

sample({
  clock: $modelSettingsOpened,
  target: closeSidebar,
  filter: (opened) => opened,
});
