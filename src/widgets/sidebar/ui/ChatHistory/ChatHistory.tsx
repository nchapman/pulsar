import { memo } from 'preact/compat';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { withObservables } from '@nozbe/watermelondb/react';
import { useUnit } from 'effector-react/effector-react.mjs';
import { chatsRepository } from '@/db';
import { Chat } from '@/db/chat';
import { classNames } from '@/shared/lib/func';
import s from './ChatHistory.module.scss';
import { ChatHistoryItem } from '../ChatHistoryItem/ChatHistoryItem';
import { NewChatBtn } from '../NewChatBtn/NewChatBtn.tsx';
import { groupChats } from '@/widgets/sidebar/lib/groupChats.ts';
import { $chat } from '@/widgets/chat';

interface Props {
  className?: string;
  chatsCount?: number;
}

const ChatHistory = memo((props: Props) => {
  const { className, chatsCount } = props;

  const [chats, setChats] = useState<Chat[]>([]);
  const currChatId = useUnit($chat.id);

  useEffect(() => {
    chatsRepository.getAll({ limit: 28 }).then(setChats);
  }, [chatsCount]);

  const chatsList = useMemo(
    () =>
      groupChats(chats).map(({ chats, period }) => (
        <div className={s.group}>
          <div className={s.period}>{period}</div>
          <div className={s.chats}>
            {chats.map((chat) => (
              <ChatHistoryItem key={chat.id} id={chat.id} isCurrent={currChatId === chat.id} />
            ))}
          </div>
        </div>
      )),
    [chats, currChatId]
  );

  return (
    <div className={classNames(s.chatHistory, [className])}>
      <NewChatBtn className={s.newChatBtn} />

      <div className={s.list}>
        <div className={s.whiteSpace} />

        {chatsList}
      </div>
    </div>
  );
});

const enhance = withObservables([], () => ({
  chatsCount: chatsRepository.chatsCollection.query().observeCount(),
}));

const EnhancedChatHistory = enhance(ChatHistory);

export { EnhancedChatHistory as ChatHistory };
