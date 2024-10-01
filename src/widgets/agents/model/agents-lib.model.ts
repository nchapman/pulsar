import { sample } from 'effector';
import { createEffect } from 'effector/effector.umd';

import { goToAgents, goToAgentsDetails } from '@/app/routes';
import { getState } from '@/shared/lib/func';
import { agentsMock } from '@/widgets/agents/mocks/agents.mock.ts';
import { Agent } from '@/widgets/agents/types/agent.types.ts';

import { AgentsSorting } from '../types/agents-sorting.types.ts';

const [$sorting, setSorting] = getState(AgentsSorting.TRENDING);
const [$listScroll, setListScroll] = getState(0);
const [$currAgent, setCurrAgent] = getState<Id | null>(null);
const [$agents] = getState<Agent[]>(agentsMock);

// derived
const $agentsMap = $agents.map((agents) =>
  agents.reduce<Record<Id, Agent>>((acc, agent) => ({ ...acc, [agent.id]: agent }), {})
);

const $currAgentData = $currAgent.map((id) => (id ? $agentsMap.getState()[id] : null));

export const agentsLibModel = {
  $sorting,
  setSorting,

  $listScroll,
  setListScroll,

  $currAgent,
  setCurrAgent,

  $agents,
  $currAgentData,
};

sample({
  clock: agentsLibModel.setCurrAgent,
  target: createEffect((id: Id | null) => {
    if (id) {
      goToAgentsDetails();
    } else {
      goToAgents();
    }
  }),
});
