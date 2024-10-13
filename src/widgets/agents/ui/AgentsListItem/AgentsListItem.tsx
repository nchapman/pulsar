import { memo } from 'preact/compat';

import CheckIcon from '@/shared/assets/icons/check-circle-filled.svg';
import MoreIcon from '@/shared/assets/icons/dots-vertical.svg';
import { classNames } from '@/shared/lib/func';
import { useToggle } from '@/shared/lib/hooks';
import { Button, Icon, Text } from '@/shared/ui';
import { PopoverCustom } from '@/shared/ui/PopoverCustom/PopoverCustom.tsx';
import { Toggle } from '@/shared/ui/Toggle/Toggle.tsx';
import { agentsNavbarModel } from '@/widgets/agents/model/agents-navbar.model.ts';

import { AgentsView, StoreAgent } from '../../types/agent.types.ts';
import s from './AgentsListItem.module.scss';

interface Props {
  className?: string;
  agent: StoreAgent;
  view: AgentsView;
}

export const AgentsListItem = memo((props: Props) => {
  const { className, view, agent } = props;
  const { toggle: togglePopover, isOn: isPopoverShown, off: hidePopover } = useToggle();

  const handleRemove = (e: any) => {
    e.stopPropagation();
    console.log('Remove');
    hidePopover();
  };

  const handleViewDetails = (e: any) => {
    e.stopPropagation();
    agentsNavbarModel.setDetailsAgent(agent.id);
    hidePopover();
  };

  const addBtn = (
    <Button variant="secondary" className={s.addBtn}>
      Add
    </Button>
  );

  const added = <Icon size={20} svg={CheckIcon} className={s.added} />;

  const popoverContent = (
    <div className={s.popover}>
      <Button className={s.popoverBtn} variant="clear" onClick={handleViewDetails}>
        View details
      </Button>
      <Button
        onClick={handleRemove}
        className={classNames(s.popoverBtn, [s.error])}
        variant="clear"
      >
        Remove
      </Button>
    </div>
  );

  const widget = () => {
    if (view === AgentsView.AllAgents) {
      return Math.random() > 0.5 ? addBtn : added;
    }

    return (
      <div className={s.myAgentItemActions}>
        <Toggle checked onChange={() => null} />

        <PopoverCustom
          alignV="top"
          alignH="left"
          onClose={hidePopover}
          open={isPopoverShown}
          content={popoverContent}
        >
          <Button onClick={togglePopover} variant="clear" icon={MoreIcon} />
        </PopoverCustom>
      </div>
    );
  };

  return (
    <div className={classNames(s.agentsListItem, [className])}>
      <img src={agent.icon} alt={agent.name} className={s.icon} />
      <div className={s.info}>
        <Text s={14} c="primary" w="medium" className={s.name}>
          {agent.name}
        </Text>
        <Text s={12} className={s.description}>
          {agent.description}
        </Text>
      </div>

      <div className={s.widget}>{widget()}</div>
    </div>
  );
});
