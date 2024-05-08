import { useStoreMap } from 'effector-react';

import { classNames } from '@/shared/lib/func';
import { $chat } from '@/widgets/chat';
import { UnarchiveChat } from '@/widgets/chat/ui/UnarchiveChat/UnarchiveChat.tsx';

import { ChatInput } from '../ChatInput/ChatInput';
import { ChatMsgList } from '../ChatMsgList/ChatMsgList';
import s from './Chat.module.scss';

interface Props {
  className?: string;
}

export const Chat = (props: Props) => {
  const { className } = props;

  const isArchived = useStoreMap({
    keys: [],
    store: $chat.data,
    fn: (data) => data?.isArchived,
  });

  return (
    <div className={classNames(s.chat, [className])}>
      <ChatMsgList className={s.msgList} />
      {isArchived ? <UnarchiveChat /> : <ChatInput className={s.chatInput} />}
    </div>
  );
};
