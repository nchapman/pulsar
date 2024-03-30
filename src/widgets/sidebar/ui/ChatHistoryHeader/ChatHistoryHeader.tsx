import { memo } from 'preact/compat';

import NewChatIcon from '@/shared/assets/icons/edit.svg';
import SearchIcon from '@/shared/assets/icons/search.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Logo, Text, Tooltip } from '@/shared/ui';
import { startNewChat } from '@/widgets/chat';

import s from './ChatHistoryHeader.module.scss';

interface Props {
  className?: string;
}

export const ChatHistoryHeader = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.wrapper, [className])}>
      <div className={s.chatHistoryHeader}>
        <div className={s.left}>
          <Logo className={s.logo} />
          <Text c="primary" s={14}>
            Pulsar
          </Text>
        </div>

        <div className={s.left}>
          <Tooltip position="bottom" text="Search Chats ⌘/">
            <Button icon={SearchIcon} onClick={startNewChat} variant="clear" iconSize={16} />
          </Tooltip>

          <Tooltip position="bottom" text="Start new chat">
            <Button icon={NewChatIcon} onClick={startNewChat} variant="clear" iconSize={16} />
          </Tooltip>
        </div>
      </div>
    </div>
  );
});
