import { memo } from 'preact/compat';
import { Button, Text } from '@/shared/ui';
import { classNames } from '@/shared/lib/func';
import s from './Navbar.module.scss';
import { switchChat, startNewChat } from '@/widgets/chat';
import { NewChatIcon } from '../../assets/NewChatIcon';

interface Props {
  className?: string;
}

export const Navbar = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.navbar, [className])}>
      <Button onClick={startNewChat}>
        <NewChatIcon />
      </Button>
      <Text className={s.title} type="heading-1">
        Pulsar 1.0
      </Text>

      <div className={s.history}>
        {['1', '2', '3'].map((chatId) => (
          <Button key={chatId} onClick={() => switchChat(chatId)}>
            C{chatId}
          </Button>
        ))}
      </div>
    </div>
  );
});
