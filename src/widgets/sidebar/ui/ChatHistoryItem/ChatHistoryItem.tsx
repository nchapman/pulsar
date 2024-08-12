import { withObservables } from '@nozbe/watermelondb/react';
import { createEvent, createStore } from 'effector';
import { useUnit } from 'effector-react';
import { FC, memo } from 'preact/compat';
import { useCallback, useEffect, useState } from 'preact/hooks';

import { chatsRepository } from '@/db';
import { ChatModel } from '@/db/chat';
import { chatsMock } from '@/db/chat/chats.mock.ts';
import { classNames } from '@/shared/lib/func';
import { useKeyboardListener, useToggle } from '@/shared/lib/hooks';
import { fallbackFn } from '@/shared/storybook';
import { Button, Input } from '@/shared/ui';
import { switchChat } from '@/widgets/chat';

import { ChatHistoryActions } from '../ChatHistoryActions/ChatHistoryActions.tsx';
import s from './ChatHistoryItem.module.scss';

interface Props {
  className?: string;
  chat?: ChatModel;
  isCurrent: boolean;
  id: string;
  unavailable?: boolean;
}

const $shownPopoverId = createStore<string | null>(null);
const changeShownPopoverId = createEvent<string | null>();
$shownPopoverId.on(changeShownPopoverId, (_, id) => id);

const ChatHistoryItem = (props: Props) => {
  const { className, chat, id, isCurrent, unavailable } = props;
  const { isOn: isPopoverShown, off: hidePopover, on: openPopover } = useToggle();
  const [newTitle, setNewTitle] = useState(chat?.title);
  const { isOn: isRenaming, toggle: toggleRename, off: stopRenaming } = useToggle();

  const shownPopoverId = useUnit($shownPopoverId);

  useEffect(() => {
    if (id !== shownPopoverId) {
      hidePopover();
    }
  }, [hidePopover, id, shownPopoverId]);
  const handleChatClick = () => switchChat(id);

  const handleChatUpdate = useCallback(() => {
    if (!isRenaming) return;

    if (newTitle && newTitle !== chat?.title) {
      chatsRepository.update(id, { title: newTitle });
    }
    stopRenaming();
  }, [chat?.title, id, isRenaming, newTitle, stopRenaming]);

  const handleOpenPopover = useCallback(() => {
    openPopover();
    changeShownPopoverId(id);
  }, [id, openPopover]);

  const handleClosePopover = useCallback(() => {
    hidePopover();
    changeShownPopoverId(null);
  }, [hidePopover]);

  useKeyboardListener(handleChatUpdate, 'Enter');

  return (
    <Button
      variant="clear"
      active={(isCurrent || isPopoverShown) && !isRenaming}
      notActive={isRenaming}
      onClick={handleChatClick}
      className={classNames(s.chatHistoryItem, [className], { [s.unavailable]: unavailable })}
      suffixClassName={s.suffixWrapper}
      endFade
      disabled={unavailable}
      activeSuffix={
        <ChatHistoryActions
          isOpen={isPopoverShown}
          onClose={handleClosePopover}
          onOpen={handleOpenPopover}
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
        `${chat?.title}${unavailable ? ' [no model present]' : ''}`
      )}
    </Button>
  );
};

const enhance = fallbackFn(
  withObservables(['id'], ({ id }: Props) => ({
    chat: chatsRepository.chatsCollection.findAndObserve(id),
  })),
  (C: FC<Props>) => (props: Props) =>
    <C {...props} chat={chatsMock.find((i) => i.id === props?.id) as ChatModel} />
);

// @ts-ignore
const EnhancedChatHistoryItem = memo(enhance(ChatHistoryItem));

export { EnhancedChatHistoryItem as ChatHistoryItem };
