import { memo } from 'preact/compat';
import { useState } from 'preact/hooks';

import CloseIcon from '@/shared/assets/icons/close.svg';
import NewChatIcon from '@/shared/assets/icons/edit.svg';
import SearchIcon from '@/shared/assets/icons/search.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Input, Logo, Text, Tooltip } from '@/shared/ui';
import { startNewChat } from '@/widgets/chat';

import s from './ChatHistoryHeader.module.scss';

interface Props {
  className?: string;
  search: string;
  onSearchChange: (search: string) => void;
}

export const ChatHistoryHeader = memo((props: Props) => {
  const { className, onSearchChange, search } = props;
  const [isSearchActive, setIsSearchActive] = useState(false);

  const onSearch = () => {
    setIsSearchActive(true);
  };

  const onSearchClose = () => {
    onSearchChange('');
    setIsSearchActive(false);
  };

  if (isSearchActive)
    return (
      <div className={classNames(s.wrapper, [className])}>
        <div className={s.search}>
          <Button
            variant="clear"
            icon={SearchIcon}
            onClick={onSearchClose}
            className={s.searchIcon}
          />
          <Input
            value={search}
            onChange={onSearchChange}
            className={s.searchInput}
            placeholder="Search Chats"
          />
          <Button variant="clear" icon={CloseIcon} iconSize={16} onClick={onSearchClose} />
        </div>
      </div>
    );

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
            <Button icon={SearchIcon} onClick={onSearch} variant="clear" iconSize={16} />
          </Tooltip>

          <Tooltip position="bottom" text="Start new chat">
            <Button icon={NewChatIcon} onClick={startNewChat} variant="clear" iconSize={16} />
          </Tooltip>
        </div>
      </div>
    </div>
  );
});