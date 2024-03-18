import { useStoreMap } from 'effector-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { classNames } from '@/shared/lib/func';
import { Logo } from '@/shared/ui';

import userImg from '../../assets/user.jpeg';
import { $messages } from '../../model/chat.ts';
import s from './ChatMessage.module.scss';

interface Props {
  className?: string;
  id: Id;
}

export const ChatMessage = (props: Props) => {
  const { className, id } = props;

  const msg = useStoreMap({
    store: $messages.data,
    keys: [id],
    fn: (msgMap, [msgId]) => msgMap[msgId],
  });

  const { text, isUser } = msg;

  return (
    <div className={classNames(s.chatMessageWrapper, [className])}>
      <div className={s.chatMessage}>
        <div className={s.authorIcon}>
          {isUser ? <img src={userImg} alt="author" /> : <Logo className={s.logo} />}
        </div>

        <div>
          <div className={s.authorName}>{isUser ? 'You' : 'Pulsar'}</div>
          <div className={s.text}>
            <Markdown className={s.markdown} remarkPlugins={[remarkGfm]}>
              {text}
            </Markdown>
          </div>
          <div className={s.actions}></div>
        </div>
      </div>
    </div>
  );
};
