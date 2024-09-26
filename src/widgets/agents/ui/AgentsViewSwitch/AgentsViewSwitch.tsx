import { createStore } from 'effector';
import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { classNames, getState } from '@/shared/lib/func';
import { Button } from '@/shared/ui';

import { AgentsView } from '../../types/agent.types.ts';
import s from './AgentsViewSwitch.module.scss';

interface Props {
  className?: string;
}

export const [$agentsNavbarView, setAgentsNavbarView] = getState<AgentsView>(AgentsView.AllAgents);
const $myAgentsNum = createStore(0);

export const AgentsViewSwitch = memo((props: Props) => {
  const { className } = props;
  const agentsView = useUnit($agentsNavbarView);
  const myAgentsNum = useUnit($myAgentsNum);

  const switchOptions = [
    {
      value: AgentsView.MyAgents,
      label: (
        <>
          {AgentsView.MyAgents} <span className={s.myAgentsNum}>{myAgentsNum}</span>
        </>
      ),
    },
    {
      label: AgentsView.AllAgents,
      value: AgentsView.AllAgents,
    },
  ];

  return (
    <div className={classNames(s.agentsViewSwitch, [className])}>
      {switchOptions.map((o) => (
        <Button
          key={o.value}
          onClick={() => setAgentsNavbarView(o.value)}
          variant="tertiary"
          active={agentsView === o.value}
          className={classNames(s.switchBtn, [], { [s.active]: agentsView === o.value })}
        >
          {o.label}
        </Button>
      ))}
    </div>
  );
});
