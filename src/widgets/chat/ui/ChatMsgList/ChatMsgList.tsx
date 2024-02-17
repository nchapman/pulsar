import { useList } from 'effector-react';
import { classNames } from '@/shared/lib/func';
import s from './ChatMsgList.module.scss';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { $msgIdsList } from '../../model/chat.ts';

interface Props {
  className?: string;
}

export const ChatMsgList = (props: Props) => {
  const { className } = props;

  const list = useList($msgIdsList, (msgId) => <ChatMessage id={msgId} />);

  return <div className={classNames(s.chatMsgList, [className])}>{list}</div>;
};
