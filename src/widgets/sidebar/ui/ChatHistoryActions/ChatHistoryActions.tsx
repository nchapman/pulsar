import { memo } from 'preact/compat';
import { useCallback, useEffect, useRef } from 'preact/hooks';
import { Popover } from 'react-tiny-popover';

import { chatsRepository } from '@/db';
import ArchiveIcon from '@/shared/assets/icons/archive.svg';
import DotsIcon from '@/shared/assets/icons/dots-vertical.svg';
import EditIcon from '@/shared/assets/icons/edit.svg';
import PinIcon from '@/shared/assets/icons/pin.svg';
import DeleteIcon from '@/shared/assets/icons/trash.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Icon, showToast, Text } from '@/shared/ui';
import { startNewChat } from '@/widgets/chat';
import { deleteChatWithConfirm } from '@/widgets/chat/lib/deleteChat.tsx';

import s from './ChatHistoryActions.module.scss';

interface Props {
  className?: string;
  isCurrent: boolean;
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  isPinned: boolean;
  isArchived: boolean;
  onRename: () => void;
  title?: string;
}

const showArchiveToast = () => {
  showToast({
    type: 'success',
    title: 'Chat successfully archived!',
    message: (
      <>
        You can manage archived chats on the page “
        <Text s={12} c="primary">
          General settings
        </Text>
        ”
      </>
    ),
  });
};

const showPinnedToast = (chatName: string) => {
  showToast({
    type: 'success',
    title: 'Chat successfully pinned!',
    message: chatName,
  });
};

export const ChatHistoryActions = memo((props: Props) => {
  const { className, title, id, onClose, onOpen, isOpen, isPinned, isArchived, onRename } = props;
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleRenameChat = useCallback(() => {
    onRename();
    onClose();
  }, [onClose, onRename]);

  const handleDeleteChat = useCallback(() => {
    onClose();
    deleteChatWithConfirm(id);
  }, [id, onClose]);

  const handlePinChat = useCallback(() => {
    chatsRepository.update(id, { isPinned: true }).then(() => showPinnedToast(title!));
    onClose();
  }, [id, onClose, title]);

  const handleUnpinChat = useCallback(() => {
    chatsRepository.update(id, { isPinned: false });
    onClose();
  }, [id, onClose]);

  const handleArchiveChat = useCallback(() => {
    chatsRepository.update(id, { isArchived: true });
    onClose();
    startNewChat();
    showArchiveToast();
  }, [id, onClose]);

  const handleUnarchiveChat = useCallback(() => {
    chatsRepository.update(id, { isArchived: false });
    onClose();
  }, [id, onClose]);

  const popover = (
    <div className={s.popover} ref={popoverRef}>
      <Button variant="clear" className={s.actionBtn} onClick={handleRenameChat}>
        <Icon svg={EditIcon} /> Rename Chat
      </Button>
      <Button
        variant="clear"
        className={s.actionBtn}
        onClick={isPinned ? handleUnpinChat : handlePinChat}
      >
        <Icon svg={PinIcon} /> {isPinned ? 'Unpin' : 'Pin'} Chat
      </Button>
      <Button
        variant="clear"
        className={s.actionBtn}
        onClick={isArchived ? handleUnarchiveChat : handleArchiveChat}
      >
        <Icon svg={ArchiveIcon} /> {isArchived ? 'Unarchive' : 'Archive'} Chat
      </Button>

      <div className={s.divider} />

      <Button
        variant="clear"
        className={classNames(s.actionBtn, [s.deleteBtn])}
        onClick={handleDeleteChat}
      >
        <Icon svg={DeleteIcon} /> Delete Chat
      </Button>
    </div>
  );

  useEffect(() => {
    const bottom = popoverRef.current?.getBoundingClientRect().bottom;
    if (!bottom) return;
    if (bottom > window.innerHeight) {
      if (popoverRef.current) {
        popoverRef.current.style.transform = `translateY(${window.innerHeight - bottom - 10}px)`;
      }
    }
  }, [isOpen]);

  return (
    <div className={classNames(s.chatHistoryActions, [className])}>
      <Popover
        isOpen={isOpen}
        positions="bottom"
        content={popover}
        align="start"
        padding={4}
        onClickOutside={onClose}
      >
        <div>
          <Button
            iconSize={18}
            onClick={onOpen}
            className={s.trigger}
            variant="clear"
            icon={DotsIcon}
          />
        </div>
      </Popover>
    </div>
  );
});
