import { withObservables } from '@nozbe/watermelondb/react';
import { memo } from 'preact/compat';
import { useCallback, useState } from 'preact/hooks';

import { chatsRepository } from '@/db';
import { ChatModel } from '@/db/chat';
import { classNames } from '@/shared/lib/func';
import { useKeyboardListener, useToggle } from '@/shared/lib/hooks';
import { Button, Input } from '@/shared/ui';
import { switchChat } from '@/widgets/chat';

import { ChatHistoryActions } from '../ChatHistoryActions/ChatHistoryActions.tsx';
import s from './ChatHistoryItem.module.scss';

interface Props {
  className?: string;
  chat?: ChatModel;
  isCurrent: boolean;
  id: string;
}

const ChatHistoryItem = (props: Props) => {
  const { className, chat, id, isCurrent } = props;
  const { isOn: isPopoverShown, off: hidePopover, toggle: togglePopover } = useToggle();
  const [newTitle, setNewTitle] = useState(chat?.title);
  const { isOn: isRenaming, toggle: toggleRename, off: stopRenaming } = useToggle();
  const handleChatClick = () => switchChat(id);

  const handleChatUpdate = useCallback(() => {
    if (!isRenaming) return;

    if (newTitle && newTitle !== chat?.title) {
      chatsRepository.update(id, { title: newTitle });
    }
    stopRenaming();
  }, [chat?.title, id, isRenaming, newTitle, stopRenaming]);

  useKeyboardListener(handleChatUpdate, 'Enter');

  return (
    <Button
      variant="clear"
      active={(isCurrent || isPopoverShown) && !isRenaming}
      notActive={isRenaming}
      onClick={handleChatClick}
      className={classNames(s.chatHistoryItem, [className])}
      suffixClassName={s.suffixWrapper}
      endFade
      activeSuffix={
        <ChatHistoryActions
          isOpen={isPopoverShown}
          onClose={hidePopover}
          onOpen={togglePopover}
          isCurrent={isCurrent}
          id={id}
          isPinned={chat?.isPinned}
          isArchived={chat?.isArchived}
          onRename={toggleRename}
          title={chat?.title}
        />
      }
    >
      {isRenaming ? (
        <Input
          className={s.renameInput}
          value={newTitle}
          onChange={setNewTitle}
          onBlur={handleChatUpdate}
          autofocus
        />
      ) : (
        chat?.title
      )}
    </Button>
  );
};

const enhance = withObservables(['id'], ({ id }: Props) => ({
  chat: chatsRepository.chatsCollection.findAndObserve(id),
}));

// @ts-ignore
const EnhancedChatHistoryItem = memo(enhance(ChatHistoryItem));

export { EnhancedChatHistoryItem as ChatHistoryItem };
