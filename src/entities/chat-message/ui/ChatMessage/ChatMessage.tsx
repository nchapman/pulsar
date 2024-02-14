import { classNames } from '@/shared/lib/func';
import s from './ChatMessage.module.scss';

interface Props {
  className?: string;
  text: string;
  isUser: boolean;
}

export const ChatMessage = (props: Props) => {
  const { className, text, isUser } = props;

  return (
    <div className={classNames(s.chatMessage, [className])}>
      <div className={s.author}>{isUser ? 'You' : 'Pulsar'}</div>
      <div className={s.text}>{text}</div>
    </div>
  );
};
