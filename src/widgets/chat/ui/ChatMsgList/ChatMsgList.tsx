import { classNames } from '@/shared/lib/func';
import s from './ChatMsgList.module.scss';
import { ChatMessage } from '@/entities/chat-message';

interface Props {
  className?: string;
}

const messages = [
  { text: 'My Question', isUser: true },
  { text: 'My Answer', isUser: false },
];

export const ChatMsgList = (props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.chatMsgList, [className])}>
      {messages.map((i) => (
        <ChatMessage isUser={i.isUser} text={i.text} />
      ))}
    </div>
  );
};
