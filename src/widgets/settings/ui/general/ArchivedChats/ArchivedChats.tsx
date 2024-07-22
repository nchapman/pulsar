import { Q } from '@nozbe/watermelondb';
import { withObservables } from '@nozbe/watermelondb/react';
import { memo } from 'preact/compat';
import { useEffect, useMemo, useState } from 'preact/hooks';

import { chatsRepository } from '@/db';
import { Chat } from '@/db/chat';
import { chatsTable } from '@/db/chat/chat.schema.ts';
import ArchiveIcon from '@/shared/assets/icons/credit-card.svg';
import TrashIcon from '@/shared/assets/icons/trash.svg';
import { classNames } from '@/shared/lib/func';
import { Button, showToast, Text, Tooltip } from '@/shared/ui';
import { ScrollArea } from '@/shared/ui/ScrollArea/ScrollArea.tsx';
import { deleteChatWithConfirm, switchChat } from '@/widgets/chat';
import { closeSettingsModal } from '@/widgets/settings';

import s from './ArchivedChats.module.scss';

interface Props {
  className?: string;
  chatsCount?: number;
  onCloseModal: () => void;
}

function formatTime(datestamp: number) {
  return new Date(datestamp).toLocaleDateString('en-us', {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  });
}

const showUnarchiveToast = (chatName: string) => {
  showToast({
    type: 'success',
    title: 'Chat successfully unarchived!',
    message: chatName,
  });
};

const emptyChatText = "Looks like you don't have any archived conversations yet :(";

const ArchivedChats = memo((props: Props) => {
  const { className, chatsCount } = props;

  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    chatsRepository.getAll({}, true).then(setChats);
  }, [chatsCount]);

  const chatsList = useMemo(
    () => (
      <ScrollArea height="400px" className={s.chats}>
        {chats.map((chat) => (
          <div className={s.chat}>
            <Button
              className={s.title}
              variant="link"
              onClick={() => {
                switchChat(chat.id);
                closeSettingsModal();
              }}
            >
              <span>{chat.title}</span>
            </Button>
            <Text className={s.date} s={14}>
              {formatTime(chat.createdAt)}
            </Text>
            <div className={s.actions}>
              <Tooltip position="top" text="Unarchive">
                <Button
                  variant="clear"
                  icon={ArchiveIcon}
                  onClick={() =>
                    chatsRepository
                      .update(chat.id, { isArchived: false })
                      .then(() => showUnarchiveToast(chat.title))
                  }
                />
              </Tooltip>
              <Tooltip position="top" text="Delete">
                <Button
                  variant="clear"
                  icon={TrashIcon}
                  onClick={() => deleteChatWithConfirm(chat.id)}
                />
              </Tooltip>
            </div>
          </div>
        ))}
      </ScrollArea>
    ),
    [chats]
  );

  const emptyList = (
    <Text w="medium" s={14}>
      {emptyChatText}
    </Text>
  );

  return (
    <div className={classNames(s.archivedChats, [className])}>
      <div className={classNames(s.chat, [s.header])}>
        <Text s={12} w="semi" className={s.title} c="tertiary">
          Name
        </Text>
        <Text s={12} w="semi" className={s.date} c="tertiary">
          Date Created
        </Text>
        <div className={s.actions} />
      </div>

      {chats.length ? chatsList : emptyList}
    </div>
  );
});

const enhance = withObservables([], () => ({
  chatsCount: chatsRepository.chatsCollection
    .query(Q.where(chatsTable.cols.isArchived, Q.eq('true')))
    .observeCount(),
}));

// @ts-ignore
const EnhancedArchivedChats = enhance(ArchivedChats);

export { EnhancedArchivedChats as ArchivedChats };
