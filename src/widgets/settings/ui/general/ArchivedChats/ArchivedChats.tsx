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
import { Button, Text, Tooltip } from '@/shared/ui';
import { switchChat } from '@/widgets/chat';
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

const ArchivedChats = memo((props: Props) => {
  const { className, chatsCount } = props;

  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    chatsRepository.getAll({ limit: 28 }, true).then(setChats);
  }, [chatsCount]);

  const chatsList = useMemo(
    () => (
      <div className={s.chats}>
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
                  onClick={() => chatsRepository.update(chat.id, { isArchived: false })}
                />
              </Tooltip>
              <Tooltip position="top" text="Delete">
                <Button
                  variant="clear"
                  icon={TrashIcon}
                  onClick={() => chatsRepository.remove(chat.id)}
                />
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    ),
    [chats]
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

      {chatsList}
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
