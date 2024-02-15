import { classNames } from '@/shared/lib/func';
import s from './ChatMessage.module.scss';
import userImg from '../../assets/user.jpeg';
import pulsarImg from '../../assets/pulsar.jpeg';

interface Props {
  className?: string;
  text: string;
  isUser: boolean;
}

export const ChatMessage = (props: Props) => {
  const { className, text, isUser } = props;

  return (
    <div className={classNames(s.chatMessage, [className])}>
      <div className={s.authorIcon}>
        <img src={isUser ? userImg : pulsarImg} alt="author" />
      </div>

      <div>
        <div className={s.authorName}>{isUser ? 'You' : 'Pulsar'}</div>
        <div className={s.text}>{text}</div>
        <div className={s.actions}></div>
      </div>
    </div>
  );
};
