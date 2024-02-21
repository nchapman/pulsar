import { useStoreMap } from 'effector-react';
import * as stylex from '@stylexjs/stylex';
import { classNames } from '@/shared/lib/func';
import s from './ChatMessage.module.scss';
import userImg from '../../assets/user.jpeg';
import pulsarImg from '../../assets/mozilla.svg';
import { $msgMap } from '@/widgets/chat/model/chat.ts';

interface Props {
  className?: string;
  id: Id;
}

const styles = stylex.create({
  base: {
    fontSize: 16,
    lineHeight: 1.5,
    color: 'red',
  },
  highlighted: {
    color: 'red',
  },
});

export const ChatMessage = (props: Props) => {
  const { className, id } = props;

  const msg = useStoreMap({
    store: $msgMap,
    keys: [id],
    fn: (msgMap, [msgId]) => msgMap[msgId],
  });

  const { text, isUser } = msg;

  return (
    <div className={classNames(s.chatMessage, [className])}>
      <div className={s.authorIcon}>
        <img src={isUser ? userImg : pulsarImg} alt="author" />
      </div>

      <div>
        <div className={s.authorName} {...stylex.props(styles.base, styles.highlighted)}>
          {isUser ? 'You' : 'Pulsar'}
        </div>
        <div className={s.text}>{text}</div>
        <div className={s.actions}></div>
      </div>
    </div>
  );
};
