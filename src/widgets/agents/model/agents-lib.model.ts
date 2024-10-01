import { getState } from '@/shared/lib/func';

import { AgentsSorting } from '../types/agents-sorting.types.ts';

const [$sorting, setSorting] = getState(AgentsSorting.TRENDING);

const [$listScroll, setListScroll] = getState(0);

export const agentsLibModel = {
  $sorting,
  setSorting,

  $listScroll,
  setListScroll,
};
