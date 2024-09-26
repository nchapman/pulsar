import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';
import { Popover } from 'react-tiny-popover';

import PlusIcon from '@/shared/assets/icons/plus.svg';
import { classNames } from '@/shared/lib/func';
import { useToggle } from '@/shared/lib/hooks';
import { Button, Icon } from '@/shared/ui';
import { agentsMock } from '@/widgets/agents/mocks/agents.mock.ts';
import { AgentsList } from '@/widgets/agents/ui/AgentsList/AgentsList.tsx';
import { AgentsSearch } from '@/widgets/agents/ui/AgentsSearch/AgentsSearch.tsx';
import {
  $agentsNavbarView,
  AgentsViewSwitch,
} from '@/widgets/agents/ui/AgentsViewSwitch/AgentsViewSwitch.tsx';

import s from './AgentsSelectNavbar.module.scss';

interface Props {
  className?: string;
}

export const AgentsSelectNavbar = memo((props: Props) => {
  const { className } = props;
  const { off: hidePopover, toggle: togglePopover, isOn: isPopoverShown } = useToggle();
  const view = useUnit($agentsNavbarView);

  const popover = (
    <div className={s.popover}>
      <AgentsSearch onPopoverClose={hidePopover} />
      <AgentsViewSwitch className={s.switch} />
      <AgentsList view={view} agents={agentsMock} />
    </div>
  );

  const btn = (
    <Button
      onClick={togglePopover}
      variant="tertiary"
      className={classNames(s.agentsSelectNavbar, [className])}
    >
      Add agent
      <Icon svg={PlusIcon} className={s.icon} />
    </Button>
  );

  return (
    <Popover
      isOpen={isPopoverShown}
      positions={['bottom']}
      content={popover}
      align="start"
      padding={4}
      onClickOutside={hidePopover}
    >
      <div>{btn}</div>
    </Popover>
  );
});
