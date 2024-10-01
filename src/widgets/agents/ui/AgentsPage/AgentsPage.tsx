import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';
import { ScrollArea } from '@/shared/ui/ScrollArea/ScrollArea.tsx';
import { agentsMock } from '@/widgets/agents/mocks/agents.mock.ts';
import { AgentCardsList } from '@/widgets/agents/ui/AgentCardsList/AgentCardsList.tsx';
import { AgentCategories } from '@/widgets/agents/ui/AgentCategories/AgentCategories.tsx';
import { AgentsSearchInput } from '@/widgets/agents/ui/AgentsSearchInput/AgentsSearchInput.tsx';

import s from './AgentsPage.module.scss';

export const AgentsPage = memo(() => (
  <ScrollArea height="100vh" className={classNames(s.agentsPage)}>
    <Text w="semi" s={36} c="primary">
      Find & use the best agents
    </Text>

    <AgentsSearchInput className={s.input} />

    <AgentCategories className={s.categories} />

    <AgentCardsList
      agents={[...agentsMock, ...agentsMock, ...agentsMock]}
      loading={false}
      categories={[]}
    />
  </ScrollArea>
));
