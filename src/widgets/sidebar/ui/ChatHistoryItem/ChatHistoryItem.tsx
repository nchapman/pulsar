import { memo } from 'preact/compat';
import { withObservables } from '@nozbe/watermelondb/react';
import { classNames } from '@/shared/lib/func';
import s from './ChatHistoryItem.module.scss';
import { ChatModel } from '@/db/chat';
import { Button } from '@/shared/ui';
import { chatsRepository } from '@/db';
import { switchChat } from '@/widgets/chat';
import { DeleteChatIcon } from '@/widgets/sidebar/assets/DeleteChatIcon.tsx';

interface Props {
  className?: string;
  chat?: ChatModel;
  isCurrent: boolean;
  id: string;
}

const ChatHistoryItem = (props: Props) => {
  const { className, chat, id, isCurrent } = props;

  const handleChatClick = () => switchChat(id);

  const handleDeleteChat = () => chatsRepository.remove(id);

  return (
    <Button
      type="clear"
      active={isCurrent}
      onClick={handleChatClick}
      className={classNames(s.chatHistoryItem, [className])}
      activeSuffix={
        <Button onClick={handleDeleteChat} type="clear" icon={DeleteChatIcon} iconSize={18} />
      }
    >
      {chat?.title}
    </Button>
  );
};

const enhance = withObservables(['id'], ({ id }: Props) => ({
  chat: chatsRepository.chatsCollection.findAndObserve(id),
}));

const EnhancedChatHistoryItem = memo(enhance(ChatHistoryItem));

export { EnhancedChatHistoryItem as ChatHistoryItem };
