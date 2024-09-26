import { getState } from '@/shared/lib/func';

export const [$detailsAgent, setDetailsAgent] = getState<Id | null>(null);

export const agentsNavbarModel = {
  $detailsAgent,
  setDetailsAgent,
};
