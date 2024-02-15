import { classNames } from '@/shared/lib/func';
import s from './Chat.module.scss';
import { ChatMsgList } from '../ChatMsgList/ChatMsgList';
import { ChatInput } from '../ChatInput/ChatInput';

interface Props {
  className?: string;
}

export const Chat = (props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.chat, [className])}>
      <ChatMsgList />
      <ChatInput />
    </div>
  );
};
