import { memo } from 'preact/compat';

import CheckIcon from '@/shared/assets/icons/check-circle-filled.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Icon, Text } from '@/shared/ui';
import { ScrollArea } from '@/shared/ui/ScrollArea/ScrollArea.tsx';

import { Agent, AgentsView } from '../../types/agent.types.ts';
import s from './AgentsList.module.scss';

interface Props {
  className?: string;
  agents: Agent[];
  view: AgentsView;
}

function getHeight(num: number) {
  const maxHeight = 340;
  const itemHeight = 55;
  const gap = 8;

  const overallHeight = num * itemHeight + gap * (num - 1);
  return overallHeight < maxHeight ? overallHeight : maxHeight;
}

function getRandomBool() {
  return Math.random() > 0.5;
}

export const AgentsList = memo((props: Props) => {
  const { className, agents, view } = props;

  const addBtn = (
    <Button variant="secondary" className={s.addBtn}>
      Add
    </Button>
  );

  const added = <Icon size={20} svg={CheckIcon} className={s.added} />;

  const getWidget = (agent: Agent) => {
    console.log(agent.name);
    if (view === AgentsView.AllAgents) {
      return getRandomBool() ? addBtn : added;
    }

    return null;
  };

  return (
    <ScrollArea
      height={`${getHeight(agents.length)}px`}
      className={classNames(s.agentsList, [className])}
    >
      {agents.map((agent) => (
        <div key={agent.name} className={s.agent}>
          <img src={agent.icon} alt={agent.name} className={s.icon} />
          <div className={s.info}>
            <Text s={14} c="primary" w="medium" className={s.name}>
              {agent.name}
            </Text>
            <Text s={12} className={s.description}>
              {agent.description}
            </Text>
          </div>

          <div className={s.widget}>{getWidget(agent)}</div>
        </div>
      ))}
    </ScrollArea>
  );
});
