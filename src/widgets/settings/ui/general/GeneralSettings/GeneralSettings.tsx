import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { chatsRepository } from '@/db';
import { classNames } from '@/shared/lib/func';
import { $theme, changeTheme, Theme } from '@/shared/theme';
import { Button, Select } from '@/shared/ui';
import { startNewChat } from '@/widgets/chat';
import { updateChatHistory } from '@/widgets/sidebar';

import MonitorIcon from '../../../assets/monitor.svg';
import MoonIcon from '../../../assets/moon.svg';
import SunIcon from '../../../assets/sun.svg';
import { SettingsItem } from '../../common/SettingsItem/SettingsItem.tsx';
import s from './GeneralSettings.module.scss';

interface Props {
  className?: string;
  onChangeRoute: (route: string) => void;
}

const options = [
  { label: 'System', value: 'system', icon: MonitorIcon },
  { label: 'Light', value: 'light', icon: SunIcon },
  { label: 'Dark', value: 'dark', icon: MoonIcon },
];

const archiveAllChats = async () => {
  await chatsRepository.archiveAll();
  updateChatHistory();
  startNewChat();
};

const deleteAllChats = async () => {
  await chatsRepository.removeAll();
  updateChatHistory();
  startNewChat();
};

export const GeneralSettings = memo((props: Props) => {
  const { className, onChangeRoute } = props;
  const theme = useUnit($theme);

  return (
    <div className={classNames(s.generalSettings, [className])}>
      <SettingsItem
        title="Theme"
        action={
          <Select
            onChange={(theme) => changeTheme(theme as Theme)}
            value={theme}
            options={options}
            optionClassName={s.themeOption}
          />
        }
      />
      <SettingsItem
        title="Archived chats"
        description="Here you can manage your archived chats. Conversations are carefully stored for easy access and reference."
        action={
          <Button onClick={() => onChangeRoute('archived')} variant="secondary">
            Manage
          </Button>
        }
      />
      <SettingsItem
        title="Archive all chats"
        action={
          <Button onClick={archiveAllChats} variant="secondary">
            Archive all
          </Button>
        }
        description="Archiving all chats ensures that your conversations are safely stored for future retrieval."
      />
      <SettingsItem
        title="Delete all chats"
        action={
          <Button onClick={deleteAllChats} variant="danger">
            Delete all
          </Button>
        }
      />
    </div>
  );
});
