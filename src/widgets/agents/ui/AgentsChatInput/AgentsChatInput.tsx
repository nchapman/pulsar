import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';
import { Popover } from 'react-tiny-popover';

import { classNames } from '@/shared/lib/func';
import { Button, Text } from '@/shared/ui';

import { agentsChatInputModel } from '../../model/agents-chat-input.model.ts';
import s from './AgentsChatInput.module.scss';

interface Props {
  className?: string;
}

export const AgentsChatInput = memo((props: Props) => {
  const { className } = props;
  const isPopoverOpen = useUnit(agentsChatInputModel.$open);

  const popover = (
    <div className={s.popover}>
      <div className={s.header}>
        <Text s={12} w="medium">
          Choose Agent
        </Text>
      </div>
      <div className={s.list}></div>
      <div className={s.footer}>
        <Text s={12} w="medium">
          Add agent
        </Text>
      </div>
    </div>
  );

  return (
    <Popover isOpen={isPopoverOpen} content={popover} onClickOutside={agentsChatInputModel.close}>
      <div className={classNames(s.agentsChatInput, [className])}>
        <Text s={12}>Selected 1 agent</Text>
        <Button className={s.clearBtn} variant="clear">
          Clear
        </Button>
      </div>
    </Popover>
  );
});
