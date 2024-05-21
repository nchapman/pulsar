import { Q } from '@nozbe/watermelondb';
import { withObservables } from '@nozbe/watermelondb/react';
import { useUnit } from 'effector-react/effector-react.mjs';
import { memo } from 'preact/compat';
import { useEffect, useMemo, useState } from 'preact/hooks';
import Scrollbars from 'react-custom-scrollbars';

import { chatsRepository } from '@/db';
import { Chat } from '@/db/chat';
import { chatsTable } from '@/db/chat/chat.schema.ts';
import { classNames, debounce } from '@/shared/lib/func';
import { Collapsible, Text } from '@/shared/ui';
import { $chat } from '@/widgets/chat';
import { groupChats } from '@/widgets/sidebar/lib/groupChats.ts';

import { ChatHistoryHeader } from '../ChatHistoryHeader/ChatHistoryHeader.tsx';
import { ChatHistoryItem } from '../ChatHistoryItem/ChatHistoryItem';
import s from './ChatHistory.module.scss';

interface Props {
  className?: string;
  chatsCount?: number;
  status?: any;
}

const ChatHistory = memo((props: Props) => {
  const { className, chatsCount, status } = props;
  const [search, setSearch] = useState('');

  const [chats, setChats] = useState<Chat[]>([]);
  const currChatId = useUnit($chat.id);

  useEffect(() => {
    setSearch('');
    chatsRepository.getAll({ limit: 28 }).then(setChats);
  }, [chatsCount, status]);

  useEffect(() => {
    const getHistoryItems = () => chatsRepository.getAll({ limit: 28, search }).then(setChats);

    const [getHistoryItemsDebounced, teardown] = debounce(getHistoryItems, 500);

    getHistoryItemsDebounced();

    return teardown;
  }, [search]);

  const chatsList = useMemo(
    () =>
      groupChats(chats).map(({ chats, period }) => (
        <Collapsible
          withIcon
          defaultExpanded
          head={
            <Text w="medium" s={12} className={s.period}>
              {period}
            </Text>
          }
        >
          <div className={s.chats}>
            {chats.map((chat) => (
              <ChatHistoryItem key={chat.id} id={chat.id} isCurrent={currChatId === chat.id} />
            ))}
          </div>
        </Collapsible>
      )),
    [chats, currChatId]
  );

  return (
    <div className={classNames(s.chatHistory, [className])}>
      <ChatHistoryHeader search={search} onSearchChange={setSearch} className={s.header} />

      <Scrollbars style={{ width: 'calc(100% + 10px)' }} className={s.list}>
        {chatsList}
      </Scrollbars>
    </div>
  );
});

const enhance = withObservables([], () => ({
  chatsCount: chatsRepository.chatsCollection
    .query(Q.where(chatsTable.cols.isArchived, Q.eq('false')))
    .observeCount(),
  status: chatsRepository.chatsCollection
    .query()
    .observeWithColumns([chatsTable.cols.isArchived, chatsTable.cols.isPinned]),
}));

// @ts-ignore
const EnhancedChatHistory = enhance(ChatHistory);

export { EnhancedChatHistory as ChatHistory };
