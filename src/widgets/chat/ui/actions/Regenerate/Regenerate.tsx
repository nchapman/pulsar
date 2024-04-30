import { memo } from 'preact/compat';

import RestartIcon from '@/shared/assets/icons/restart.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Tooltip } from '@/shared/ui';

import { regenerateAnswer } from '../../../model/chat.ts';
import s from './Regenerate.module.scss';

interface Props {
  className?: string;
  msgId: Id;
}

export const Regenerate = memo((props: Props) => {
  const { className, msgId } = props;

  return (
    <Tooltip text="Regenerate">
      <Button
        iconSize={16}
        className={classNames(s.regenerate, [className])}
        onClick={() => regenerateAnswer(msgId)}
        variant="clear"
        icon={RestartIcon}
      />
    </Tooltip>
  );
});
