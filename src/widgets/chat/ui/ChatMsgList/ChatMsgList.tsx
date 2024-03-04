import { useList } from 'effector-react';
import { useCallback, useEffect, useRef } from 'preact/hooks';

import { classNames } from '@/shared/lib/func';

import { $messages } from '../../model/chat.ts';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import s from './ChatMsgList.module.scss';

interface Props {
  className?: string;
}

export const ChatMsgList = (props: Props) => {
  const { className } = props;
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((instant = false) => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: instant ? 'instant' : 'smooth',
    });
  }, []);

  useEffect(() => {
    scrollToBottom(true);
  }, [scrollToBottom]);

  // @ts-ignore
  const list = useList($messages.idsList, (msgId) => <ChatMessage id={msgId} />);

  return (
    <div ref={listRef} className={classNames(s.chatMsgList, [className])}>
      {list}
    </div>
  );
};
