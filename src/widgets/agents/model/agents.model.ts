import { createEffect, sample } from 'effector';

import { getState } from '@/shared/lib/func';
import { $chat } from '@/widgets/chat';

import { agentsManager } from '../managers/agents.manager.ts';

export const [$chatAgents, setChatAgents] = getState(0);

// Set active agents
sample({
  clock: $chat.data.map((chat) => chat?.agents.active!),
  filter: (agents) => !!agents?.length,
  target: createEffect<Id[], void>((activeAgents) => {
    agentsManager.setActive(activeAgents);
  }),
});
