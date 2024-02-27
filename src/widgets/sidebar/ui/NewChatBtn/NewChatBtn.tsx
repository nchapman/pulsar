import { memo } from 'preact/compat';
import { classNames } from '@/shared/lib/func';
import s from './NewChatBtn.module.scss';
import { Button } from '@/shared/ui';
import { NewChatIcon } from '@/widgets/sidebar/assets/NewChatIcon.tsx';
import { startNewChat } from '@/widgets/chat';

interface Props {
  className?: string;
}

export const NewChatBtn = memo((props: Props) => {
  const { className } = props;

  return (
    <Button onClick={startNewChat} type="clear" className={classNames(s.newChatBtn, [className])}>
      New chat
      <NewChatIcon />
    </Button>
  );
});
