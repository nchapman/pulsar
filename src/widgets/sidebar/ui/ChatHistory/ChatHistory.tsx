import { Q } from '@nozbe/watermelondb';
import { withObservables } from '@nozbe/watermelondb/react';
import { useUnit } from 'effector-react/effector-react.mjs';
import { FC, memo } from 'preact/compat';
import { useEffect, useMemo, useState } from 'preact/hooks';

import { chatsRepository } from '@/db';
import { Chat } from '@/db/chat';
import { chatsTable } from '@/db/chat/chat.schema.ts';
import { classNames, debounce } from '@/shared/lib/func';
import { fallbackFn } from '@/shared/storybook';
import { Collapsible, Text } from '@/shared/ui';
import { ScrollArea } from '@/shared/ui/ScrollArea/ScrollArea.tsx';
import { $chat } from '@/widgets/chat';

import { groupChats } from '../../lib/groupChats.ts';
import { ChatHistoryHeader } from '../ChatHistoryHeader/ChatHistoryHeader.tsx';
import { ChatHistoryItem } from '../ChatHistoryItem/ChatHistoryItem';
import s from './ChatHistory.module.scss';

interface Props {
  className?: string;
  chatsCount?: number;
  status?: any;
  pinnedChatsCount?: number;
}

const ChatHistory = memo((props: Props) => {
  const { className, chatsCount, status, pinnedChatsCount } = props;
  const [search, setSearch] = useState('');

  const [chats, setChats] = useState<Chat[]>([]);
  const currChatId = useUnit($chat.id);

  useEffect(() => {
    setSearch('');
    chatsRepository.getAll({ limit: 1000 }).then(setChats);
  }, [chatsCount, status, pinnedChatsCount]);

  useEffect(() => {
    const getHistoryItems = () => chatsRepository.getAll({ limit: 1000, search }).then(setChats);

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
          updateHeightFlag={chats.length}
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

      <ScrollArea height="100%" width="calc(100% + 10px)" className={s.list}>
        {chatsList}
      </ScrollArea>
    </div>
  );
});

const enhanceDB = withObservables([], () => ({
  chatsCount: chatsRepository.chatsCollection
    .query(Q.where(chatsTable.cols.isArchived, Q.eq('false')))
    .observeCount(),
  pinnedChatsCount: chatsRepository.chatsCollection
    .query(Q.where(chatsTable.cols.isPinned, Q.eq('true')))
    .observeCount(),
  status: chatsRepository.chatsCollection
    .query()
    .observeWithColumns([chatsTable.cols.isArchived, chatsTable.cols.isPinned]),
}));

const enhanceMock = (C: FC<Props>) => (props: Props) => <C {...props} />;

const enhance = fallbackFn(enhanceDB, enhanceMock);

// @ts-ignore
const EnhancedChatHistory = enhance(ChatHistory);

export { EnhancedChatHistory as ChatHistory, ChatHistory as ChatHistoryUI };
