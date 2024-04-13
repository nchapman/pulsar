import { useStoreMap, useUnit } from 'effector-react';
import { useMemo } from 'preact/hooks';

import { Markdown } from '@/entities/markdown';
import { classNames } from '@/shared/lib/func';
import { Logo } from '@/shared/ui';
import { CopyMsgText } from '@/widgets/chat/ui/actions/CopyMsgText/CopyMsgText.tsx';

import userImg from '../../assets/user.jpeg';
import { $messages, $streamedMsgId } from '../../model/chat.ts';
import s from './ChatMessage.module.scss';

interface Props {
  className?: string;
  id: Id;
}

export const ChatMessage = (props: Props) => {
  const { className, id } = props;
  const streamedMsgId = useUnit($streamedMsgId);
  const isStreamed = streamedMsgId === id;

  const msg = useStoreMap({
    store: $messages.data,
    keys: [id],
    fn: (msgMap, [msgId]) => msgMap[msgId],
  });

  const { text, isUser } = msg;

  const actions = useMemo(() => {
    const actions = [];

    if (!isUser) {
      if (!isStreamed) {
        actions.push(<CopyMsgText text={text} />);
      }
    }

    return actions;
  }, [isStreamed, isUser, text]);

  return (
    <div className={classNames(s.chatMessageWrapper, [className])}>
      <div className={s.chatMessage}>
        <div className={s.authorIcon}>
          {isUser ? <img src={userImg} alt="author" /> : <Logo className={s.logo} />}
        </div>

        <div className={s.body}>
          <div className={s.authorName}>{isUser ? 'You' : 'Pulsar'}</div>
          <div className={s.text}>
            <Markdown text={text} />
          </div>
          <div className={s.actions}>{actions}</div>
        </div>
      </div>
    </div>
  );
};
