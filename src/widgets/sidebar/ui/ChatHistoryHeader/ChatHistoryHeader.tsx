import { os } from '@tauri-apps/api';
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

const combinationKey: Record<os.OsType, string> = {
  Darwin: '⌘',
  Linux: 'alt',
  Windows_NT: 'alt',
};

export const ChatHistoryHeader = memo((props: Props) => {
  const { className, onSearchChange, search } = props;
  const [isSearchActive, setIsSearchActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [osType, setOsType] = useState<os.OsType>('Darwin');

  useEffect(() => {
    os.type().then(setOsType);
  }, []);

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

  const combKey = osType === 'Darwin' ? 'metaKey' : 'altKey';

  useKeyboardListener(onSearch, 'Slash', [combKey]);

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
            Hiro
          </Text>
        </div>

        <div className={s.left}>
          <Tooltip position="bottom" text={`Search Chats ${combinationKey[osType]}/`}>
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
