import { classNames } from '@/shared/lib/func';
import s from './Chat.module.scss';
import { ChatMsgList } from '../ChatMsgList/ChatMsgList';
import { ChatInput } from '../ChatInput/ChatInput';
import { Precaution } from '../Precaution/Precaution';

interface Props {
  className?: string;
}

export const Chat = (props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.chat, [className])}>
      <ChatMsgList className={s.msgList} />
      <ChatInput className={s.chatInput} />
      <Precaution />
    </div>
  );
};
