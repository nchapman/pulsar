import { convertFileSrc } from '@tauri-apps/api/tauri';
import { useStoreMap, useUnit } from 'effector-react';
import { useMemo } from 'preact/hooks';

import { Markdown } from '@/entities/markdown';
import UserIcon from '@/shared/assets/icons/user-circle.svg';
import { classNames } from '@/shared/lib/func';
import { Icon, Logo } from '@/shared/ui';

import { $messages, $streamedMsgId, isArchivedChat } from '../../model/chat.ts';
import { CopyMsgText } from '../actions/CopyMsgText/CopyMsgText.tsx';
import { Regenerate } from '../actions/Regenerate/Regenerate.tsx';
import s from './ChatMessage.module.scss';

interface Props {
  className?: string;
  id: Id;
}

export const ChatMessage = (props: Props) => {
  const { className, id } = props;
  const streamedMsgId = useUnit($streamedMsgId);
  const isStreamed = streamedMsgId === id;
  const isArchived = useUnit(isArchivedChat);

  const msg = useStoreMap({
    store: $messages.data,
    keys: [id],
    fn: (msgMap, [msgId]) => msgMap[msgId],
  });

  const { isUser, file } = msg;
  let { text } = msg;
  if (isUser) text = text.replace(/\n/g, '\n\n');

  const actions = useMemo(() => {
    const actions = [];

    if (!isUser) {
      if (!isStreamed) {
        if (!isArchived) {
          actions.push(<Regenerate msgId={msg.id} />);
        }

        actions.push(<CopyMsgText text={text} />);
      }
    }

    return actions;
  }, [isArchived, isStreamed, isUser, msg.id, text]);

  return (
    <div className={classNames(s.chatMessageWrapper, [className])}>
      <div className={s.chatMessage}>
        <div className={s.authorIcon}>{isUser ? <Icon svg={UserIcon} /> : <Logo size="s" />}</div>

        <div className={s.body}>
          <div className={s.authorName}>{isUser ? 'You' : 'Pulsar'}</div>
          <div className={s.text}>
            <Markdown text={text} isGenerating={isStreamed} />
          </div>
          {file?.type === 'image' && (
            <img src={convertFileSrc(file?.src)} alt="img" className={s.img} />
          )}
          <div className={s.actions}>{actions}</div>
        </div>
      </div>
    </div>
  );
};
