import { useList } from 'effector-react';

import { classNames } from '@/shared/lib/func';

import { $messages } from '../../model/chat.ts';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import s from './ChatMsgList.module.scss';

interface Props {
  className?: string;
}

export const ChatMsgList = (props: Props) => {
  const { className } = props;

  // @ts-ignore
  const list = useList($messages.idsList, (msgId) => <ChatMessage id={msgId} />);

  return <div className={classNames(s.chatMsgList, [className])}>{list}</div>;
};
