import { memo } from 'preact/compat';
import { withObservables } from '@nozbe/watermelondb/react';
import { classNames } from '@/shared/lib/func';
import s from './ChatHistoryItem.module.scss';
import { ChatModel } from '@/db/chat';
import { Button } from '@/shared/ui';
import { chatsRepository } from '@/db';

interface Props {
  className?: string;
  id: string;
  chat?: ChatModel;
}

const ChatHistoryItem = memo((props: Props) => {
  const { className, chat } = props;
  console.log('I change');

  return (
    <Button type="clear" className={classNames(s.chatHistoryItem, [className])}>
      {chat?.title}
    </Button>
  );
});

const enhance = withObservables(['id'], ({ id }: Props) => ({
  chat: chatsRepository.chatsCollection.findAndObserve(id),
}));

const EnhancedChatHistoryItem = enhance(ChatHistoryItem);

export { EnhancedChatHistoryItem as ChatHistoryItem };
