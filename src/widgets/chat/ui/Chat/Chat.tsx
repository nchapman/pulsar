import { classNames } from '@/shared/lib/func';

import { ChatInput } from '../ChatInput/ChatInput';
import { ChatMsgList } from '../ChatMsgList/ChatMsgList';
import s from './Chat.module.scss';

interface Props {
  className?: string;
}

export const Chat = (props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.chat, [className])}>
      <ChatMsgList className={s.msgList} />
      <ChatInput className={s.chatInput} />
    </div>
  );
};
