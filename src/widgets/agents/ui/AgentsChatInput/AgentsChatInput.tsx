import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';
import { Popover } from 'react-tiny-popover';

import CheckIcon from '@/shared/assets/icons/check-circle-filled.svg';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Icon, Text } from '@/shared/ui';
import { agentsMock } from '@/widgets/agents/mocks/agents.mock.ts';

import { agentsChatInputModel } from '../../model/agents-chat-input.model.ts';
import s from './AgentsChatInput.module.scss';

interface Props {
  className?: string;
}

const active = (idx: number) => idx % 2 === 0;

export const AgentsChatInput = memo((props: Props) => {
  const { className } = props;
  const isPopoverOpen = useUnit(agentsChatInputModel.$open);

  const agents = agentsMock;

  const popover = (
    <div className={s.popover}>
      <div className={s.header}>
        <Text s={12} w="medium">
          Choose Agent
        </Text>
      </div>

      <div className={s.list}>
        {agents.map((i, idx) => (
          <div className={classNames(s.agent, [], { [s.selected]: active(idx) })}>
            <img src={i.icon} className={s.agentIcon} />
            <Text c="primary" s={12} w="semi" className={s.agentName}>
              {i.name}
            </Text>
            <Text c="secondary" s={12} className={s.agentDesc}>
              {i.description}
            </Text>

            {active(idx) && <Icon className={s.selectedAgentIcon} svg={CheckIcon} />}
          </div>
        ))}
      </div>

      <div className={s.footer}>
        <Button
          className={s.addAgentBtn}
          type="button"
          onClick={agentsChatInputModel.openModal}
          variant="tertiary"
        >
          <div>
            <Icon svg={PlusIcon} />
          </div>
          Add agent
        </Button>
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
