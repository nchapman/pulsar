import { createEvent, createStore } from 'effector';

export enum Route {
  Chat = 'chat',
  Store = 'store',
  StoreSearch = 'storeSearch',
  StoreModel = 'storeModel',
  Downloads = 'downloads',
  Agents = 'agents',
}

export const $currRoute = createStore<Route>(Route.Chat);
export const setRoute = createEvent<Route>();

$currRoute.on(setRoute, (_, route) => route);

export const goToChat = () => setRoute(Route.Chat);
export const goToStore = () => setRoute(Route.Store);
export const goToStoreSearch = () => setRoute(Route.StoreSearch);
export const goToStoreModel = () => setRoute(Route.StoreModel);
export const goToDownloads = () => setRoute(Route.Downloads);
export const goToAgents = () => setRoute(Route.Agents);

export const $isChat = $currRoute.map((route) => route === 'chat');
