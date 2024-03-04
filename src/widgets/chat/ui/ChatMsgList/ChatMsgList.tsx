import { useList } from 'effector-react';

import ArrowDownIcon from '@/shared/assets/icons/arrow-down.svg';
import { classNames } from '@/shared/lib/func';
import { Button } from '@/shared/ui';
import { useListScroll } from '@/widgets/chat/hooks/useListScroll.ts';

import { $messages } from '../../model/chat.ts';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import s from './ChatMsgList.module.scss';

interface Props {
  className?: string;
}

export const ChatMsgList = (props: Props) => {
  const { className } = props;
  const { listRef, scrollToBottom, showScrollBtn, onStackScroll } = useListScroll();

  const list = useList($messages.idsList, (msgId) => (<ChatMessage id={msgId} />) as any);

  return (
    <div ref={listRef} className={classNames(s.chatMsgList, [className])} onScroll={onStackScroll}>
      {list}

      <Button
        icon={ArrowDownIcon}
        onClick={() => scrollToBottom()}
        className={classNames(s.scrollBtn, [], {
          [s.hidden]: !showScrollBtn,
          // [s.loading]: isQuerying,
        })}
      />
    </div>
  );
};
