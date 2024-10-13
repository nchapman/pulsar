import { useList, useUnit } from 'effector-react';
import { useEffect } from 'preact/hooks';

import ArrowDownIcon from '@/shared/assets/icons/arrow-down.svg';
import { classNames } from '@/shared/lib/func';
import { Button } from '@/shared/ui';
import { StoreAgent } from '@/widgets/agents';
import { useListScroll } from '@/widgets/chat/hooks/useListScroll.ts';
import { ChatFirstScreen } from '@/widgets/chat/ui/ChatFirstScreen/ChatFirstScreen.tsx';

import { $chat, $messages } from '../../model/chat.ts';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import s from './ChatMsgList.module.scss';

interface Props {
  className?: string;
  demo?: boolean;
  agent?: StoreAgent;
}

export const ChatMsgList = (props: Props) => {
  const { className, demo, agent } = props;
  const list = useList($messages.idsList, (msgId) => (<ChatMessage id={msgId} />) as any);
  const chatId = useUnit($chat.id);

  const { listRef, scrollToBottom, showScrollBtn, onStackScroll } = useListScroll();

  useEffect(() => {
    scrollToBottom(true);
  }, [scrollToBottom, chatId]);

  if (!(list as any).length)
    return <ChatFirstScreen demo={demo} agent={agent} className={classNames('', [className])} />;

  return (
    <div ref={listRef} className={classNames(s.chatMsgList, [className])} onScroll={onStackScroll}>
      {list}

      <Button
        variant="secondary"
        icon={ArrowDownIcon}
        onClick={() => scrollToBottom()}
        className={classNames(s.scrollBtn, [], {
          [s.hidden]: !showScrollBtn,
          // [s.loading]: isQuerying,
        })}
      />
      <div className={s.anchor}></div>
    </div>
  );
};
