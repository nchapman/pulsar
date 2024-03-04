import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Button, Logo } from '@/shared/ui';
import { startNewChat } from '@/widgets/chat';
import { NewChatIcon } from '@/widgets/sidebar/assets/NewChatIcon.tsx';

import s from './NewChatBtn.module.scss';

interface Props {
  className?: string;
}

export const NewChatBtn = memo((props: Props) => {
  const { className } = props;

  return (
    <Button onClick={startNewChat} type="clear" className={classNames(s.newChatBtn, [className])}>
      <Logo className={s.logo} />

      <span className={s.text}>New chat</span>

      <NewChatIcon />
    </Button>
  );
});
