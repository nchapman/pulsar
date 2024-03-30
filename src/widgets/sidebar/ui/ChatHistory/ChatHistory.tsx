import { withObservables } from '@nozbe/watermelondb/react';
import { useUnit } from 'effector-react/effector-react.mjs';
import { memo } from 'preact/compat';
import { useEffect, useMemo, useState } from 'preact/hooks';

import { chatsRepository } from '@/db';
import { Chat } from '@/db/chat';
import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';
import { $chat } from '@/widgets/chat';
import { groupChats } from '@/widgets/sidebar/lib/groupChats.ts';

import { ChatHistoryHeader } from '../ChatHistoryHeader/ChatHistoryHeader.tsx';
import { ChatHistoryItem } from '../ChatHistoryItem/ChatHistoryItem';
import s from './ChatHistory.module.scss';

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
          <Text w="medium" s={12} className={s.period}>
            {period}
          </Text>
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
      <ChatHistoryHeader className={s.header} />

      <div className={s.list}>{chatsList}</div>
    </div>
  );
});

const enhance = withObservables([], () => ({
  chatsCount: chatsRepository.chatsCollection.query().observeCount(),
}));

// @ts-ignore
const EnhancedChatHistory = enhance(ChatHistory);

export { EnhancedChatHistory as ChatHistory };
