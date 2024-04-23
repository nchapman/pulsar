import { memo } from 'preact/compat';
import { useCallback } from 'preact/hooks';
import { Popover } from 'react-tiny-popover';

import { chatsRepository } from '@/db';
import ArchiveIcon from '@/shared/assets/icons/archive.svg';
import DotsIcon from '@/shared/assets/icons/dots-vertical.svg';
import EditIcon from '@/shared/assets/icons/edit.svg';
import PinIcon from '@/shared/assets/icons/pin.svg';
import DeleteIcon from '@/shared/assets/icons/trash.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Icon } from '@/shared/ui';
import { startNewChat } from '@/widgets/chat';

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
}

export const ChatHistoryActions = memo((props: Props) => {
  const { className, isCurrent, id, onClose, onOpen, isOpen, isPinned, isArchived, onRename } =
    props;

  const handleRenameChat = useCallback(() => {
    onRename();
    onClose();
  }, [onClose, onRename]);

  const handleDeleteChat = useCallback(() => {
    chatsRepository.remove(id);
    if (isCurrent) startNewChat();
  }, [id, isCurrent]);

  const handlePinChat = useCallback(() => {
    chatsRepository.update(id, { isPinned: true });
    onClose();
  }, [id, onClose]);

  const handleUnpinChat = useCallback(() => {
    chatsRepository.update(id, { isPinned: false });
    onClose();
  }, [id, onClose]);

  const handleArchiveChat = useCallback(() => {
    chatsRepository.update(id, { isArchived: true });
    onClose();
  }, [id, onClose]);

  const handleUnarchiveChat = useCallback(() => {
    chatsRepository.update(id, { isArchived: false });
    onClose();
  }, [id, onClose]);

  const popover = (
    <div className={s.popover}>
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
        <Icon svg={ArchiveIcon} /> {isPinned ? 'Unarchive' : 'Archive'} Chat
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
          <Button onClick={onOpen} className={s.trigger} variant="secondary" icon={DotsIcon} />
        </div>
      </Popover>
    </div>
  );
});
