import { useUnit } from 'effector-react';

import { classNames } from '@/shared/lib/func';

import { isArchivedChat } from '../../model/chat.ts';
import { ChatInput } from '../ChatInput/ChatInput';
import { ChatMsgList } from '../ChatMsgList/ChatMsgList';
import { UnarchiveChat } from '../UnarchiveChat/UnarchiveChat.tsx';
import s from './Chat.module.scss';

export const Chat = () => {
  const isArchived = useUnit(isArchivedChat);

  return (
    <div className={classNames(s.chat)}>
      <ChatMsgList className={s.msgList} />
      {isArchived ? <UnarchiveChat /> : <ChatInput className={s.chatInput} />}
    </div>
  );
};
