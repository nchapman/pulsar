import { getState } from '@/shared/lib/func';

export enum Route {
  Chat = 'chat',
  Store = 'store',
  StoreSearch = 'storeSearch',
  StoreModel = 'storeModel',
  Downloads = 'downloads',
  Agents = 'agents',
  AgentsDetails = 'agentsDetails',
}

export const [$currRoute, setRoute] = getState(Route.Chat);

export const goToChat = () => setRoute(Route.Chat);
export const goToStore = () => setRoute(Route.Store);
export const goToStoreSearch = () => setRoute(Route.StoreSearch);
export const goToStoreModel = () => setRoute(Route.StoreModel);
export const goToDownloads = () => setRoute(Route.Downloads);
export const goToAgents = () => setRoute(Route.Agents);
export const goToAgentsDetails = () => setRoute(Route.AgentsDetails);

export const $isChat = $currRoute.map((route) => route === 'chat');
