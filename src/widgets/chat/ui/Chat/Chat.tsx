import { useUnit } from 'effector-react';

import { classNames } from '@/shared/lib/func';

import { $chat } from '../../model/chat';
import { ChatInput } from '../ChatInput/ChatInput';
import { ChatMsgList } from '../ChatMsgList/ChatMsgList';
import { Precaution } from '../Precaution/Precaution';
import s from './Chat.module.scss';

interface Props {
  className?: string;
}

export const Chat = (props: Props) => {
  const { className } = props;
  const chatId = useUnit($chat.id);

  return (
    <div className={classNames(s.chat, [className])}>
      <ChatMsgList className={s.msgList} />
      <ChatInput className={s.chatInput} />
      <Precaution />
    </div>
  );
};
