import { memo } from 'preact/compat';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';

import CloseIcon from '@/shared/assets/icons/close.svg';
import SearchIcon from '@/shared/assets/icons/search.svg';
import { classNames } from '@/shared/lib/func';
import { useKeyboardListener } from '@/shared/lib/hooks';
import { Button, Input, Logo, Text, Tooltip } from '@/shared/ui';
import { startNewChat } from '@/widgets/chat';

import NewChatIcon from '../../assets/new-chat.svg';
import s from './ChatHistoryHeader.module.scss';

interface Props {
  className?: string;
  search: string;
  onSearchChange: (search: string) => void;
}

export const ChatHistoryHeader = memo((props: Props) => {
  const { className, onSearchChange, search } = props;
  const [isSearchActive, setIsSearchActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSearch = useCallback(() => {
    setIsSearchActive(true);
  }, []);

  const onSearchClose = () => {
    onSearchChange('');
    setIsSearchActive(false);
  };

  useEffect(() => {
    if (isSearchActive) inputRef.current?.focus();
  }, [isSearchActive]);

  useKeyboardListener(onSearch, 'Slash', ['metaKey']);

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
            ref={inputRef}
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
          <Logo className={s.logo} size="m" />
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
