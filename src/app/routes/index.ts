import { createEvent, createStore } from 'effector';

export enum Route {
  Chat = 'chat',
  Store = 'store',
  StoreModel = 'storeModel',
  Downloads = 'downloads',
}

export const $currRoute = createStore<Route>(Route.Chat);
export const setRoute = createEvent<Route>();

$currRoute.on(setRoute, (_, route) => route);

export const goToChat = () => setRoute(Route.Chat);
export const goToStore = () => setRoute(Route.Store);
export const goToStoreModel = () => setRoute(Route.StoreModel);
export const goToDownloads = () => setRoute(Route.Downloads);
