import { memo } from 'preact/compat';
import { useMemo, useState } from 'preact/hooks';

import { classNames } from '@/shared/lib/func';
import { Button, Select } from '@/shared/ui';
import { SettingsItem } from '@/widgets/settings/ui/SettingsItem/SettingsItem.tsx';
import { SettingsTabWrapper } from '@/widgets/settings/ui/SettingsTabWrapper/SettingsTabWrapper.tsx';

import s from './SettingGeneral.module.scss';

interface Props {
  className?: string;
}

export const SettingGeneral = memo((props: Props) => {
  const { className } = props;
  const [isArchivedChats, setIsArchivedChats] = useState(true);

  const handleArchivedBack = () => {
    setIsArchivedChats(false);
  };

  const generalContent = useMemo(
    () => (
      <div className={s.generalContent}>
        <SettingsItem title="Theme" action={<Select options={[]} />} />
        <SettingsItem
          title="Archived chats"
          description="Here you can manage your archived chats. Conversations are carefully stored for easy access and reference."
          action={<Button variant="secondary">Manage</Button>}
        />
        <SettingsItem
          title="Archive all chats"
          action={<Button variant="outlined">Archive all</Button>}
          description="Archiving all chats ensures that your conversations are safely stored for future retrieval."
        />
        <SettingsItem
          title="Delete all chats"
          action={<Button variant="danger">Delete all</Button>}
        />
      </div>
    ),
    []
  );

  return (
    <SettingsTabWrapper
      title={isArchivedChats ? 'Archived chats' : 'General'}
      className={classNames(s.settingGeneral, [className])}
      onBack={isArchivedChats ? handleArchivedBack : undefined}
    >
      {generalContent}
    </SettingsTabWrapper>
  );
});
