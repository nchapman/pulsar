import { convertFileSrc } from '@tauri-apps/api/tauri';
import { useStoreMap, useUnit } from 'effector-react';
import { useMemo } from 'preact/hooks';

import { Markdown } from '@/entities/markdown';
import UserIcon from '@/shared/assets/icons/user-circle.svg';
import { classNames } from '@/shared/lib/func';
import { Icon, Logo } from '@/shared/ui';
import { CopyMsgText } from '@/widgets/chat/ui/actions/CopyMsgText/CopyMsgText.tsx';
import { Regenerate } from '@/widgets/chat/ui/actions/Regenerate/Regenerate.tsx';

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

  const { text, isUser, file } = msg;

  const actions = useMemo(() => {
    const actions = [];

    if (!isUser) {
      if (!isStreamed) {
        actions.push(<Regenerate msgId={msg.id} />, <CopyMsgText text={text} />);
      }
    }

    return actions;
  }, [isStreamed, isUser, msg.id, text]);

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
