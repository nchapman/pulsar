import { createEvent, createStore } from 'effector';

export enum Widgets {
  CHAT = 'chat',
  MODEL_STORE = 'modelStore',
}

export const $widget = createStore(Widgets.CHAT);
export const goToModelStore = createEvent();
export const goToChat = createEvent();

$widget.on(goToModelStore, () => Widgets.MODEL_STORE);
$widget.on(goToChat, () => Widgets.CHAT);
