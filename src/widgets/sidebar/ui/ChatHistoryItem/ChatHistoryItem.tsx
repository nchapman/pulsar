import { withObservables } from '@nozbe/watermelondb/react';
import { memo } from 'preact/compat';

import { chatsRepository } from '@/db';
import { ChatModel } from '@/db/chat';
import { classNames } from '@/shared/lib/func';
import { useToggle } from '@/shared/lib/hooks';
import { Button } from '@/shared/ui';
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
  const handleChatClick = () => switchChat(id);

  return (
    <Button
      variant="clear"
      active={isCurrent || isPopoverShown}
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
        />
      }
    >
      {chat?.title}
    </Button>
  );
};

const enhance = withObservables(['id'], ({ id }: Props) => ({
  chat: chatsRepository.chatsCollection.findAndObserve(id),
}));

// @ts-ignore
const EnhancedChatHistoryItem = memo(enhance(ChatHistoryItem));

export { EnhancedChatHistoryItem as ChatHistoryItem };
