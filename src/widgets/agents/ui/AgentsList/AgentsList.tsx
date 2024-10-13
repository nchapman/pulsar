import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { ScrollArea } from '@/shared/ui/ScrollArea/ScrollArea.tsx';
import { AgentsListItem } from '@/widgets/agents/ui/AgentsListItem/AgentsListItem.tsx';

import { AgentsView, StoreAgent } from '../../types/agent.types.ts';
import s from './AgentsList.module.scss';

interface Props {
  className?: string;
  agents: StoreAgent[];
  view: AgentsView;
}

function getHeight(num: number) {
  const maxHeight = 340;
  const itemHeight = 55;
  const gap = 8;

  const overallHeight = num * itemHeight + gap * (num - 1);
  return overallHeight < maxHeight ? overallHeight : maxHeight;
}

export const AgentsList = memo((props: Props) => {
  const { className, agents, view } = props;

  return (
    <ScrollArea
      height={`${getHeight(agents.length)}px`}
      className={classNames(s.agentsList, [className])}
    >
      {agents.map((agent) => (
        <AgentsListItem agent={agent} key={agent.id} view={view} />
      ))}
    </ScrollArea>
  );
});
