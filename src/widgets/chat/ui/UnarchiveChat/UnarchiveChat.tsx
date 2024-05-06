import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { chatsRepository } from '@/db';
import ArchiveIcon from '@/shared/assets/icons/credit-card.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Icon, Text } from '@/shared/ui';
import { $chat, switchChat } from '@/widgets/chat';

import s from './UnarchiveChat.module.scss';

interface Props {
  className?: string;
}

export const UnarchiveChat = memo((props: Props) => {
  const { className } = props;

  const chatId = useUnit($chat.id);

  const handleUnarchive = () => {
    if (!chatId) return;
    chatsRepository.update(chatId, { isArchived: false });
    switchChat(chatId);
  };

  return (
    <div className={classNames(s.unarchiveChat, [className])}>
      <Button onClick={handleUnarchive} className={s.btn} variant="primary">
        <Icon svg={ArchiveIcon} /> Unarchive Chat
      </Button>

      <Text c="tertiary" s={14}>
        This conversation is archived. To continue, please unarchive it first.
      </Text>
    </div>
  );
});
