import { memo } from 'preact/compat';

import AtIcon from '@/shared/assets/icons/at-sign.svg';
import { classNames } from '@/shared/lib/func';
import { Button } from '@/shared/ui';

import { agentsChatInputModel } from '../../model/agents-chat-input.model.ts';
import s from './AgentsChatInputBtn.module.scss';

interface Props {
  className?: string;
}

export const AgentsChatInputBtn = memo((props: Props) => {
  const { className } = props;

  const handleToggle = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    agentsChatInputModel.toggle();
  };

  return (
    <Button
      onClick={handleToggle}
      className={classNames(s.agentsChatInputBtn, [className])}
      variant="clear"
      icon={AtIcon}
    />
  );
});
