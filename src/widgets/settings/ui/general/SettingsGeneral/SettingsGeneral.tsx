import { memo } from 'preact/compat';
import { useMemo, useState } from 'preact/hooks';

import { classNames } from '@/shared/lib/func';

import { SettingsTabWrapper } from '../../common/SettingsTabWrapper/SettingsTabWrapper.tsx';
import { ArchivedChats } from '../ArchivedChats/ArchivedChats.tsx';
import { GeneralSettings } from '../GeneralSettings/GeneralSettings.tsx';
import s from './SettingsGeneral.module.scss';

interface Props {
  className?: string;
}

export const SettingsGeneral = memo((props: Props) => {
  const { className } = props;
  const [route, setRoute] = useState('general');

  const data = useMemo(
    () => ({
      general: {
        title: 'General',
        content: <GeneralSettings onChangeRoute={setRoute} />,
      },
      archived: {
        title: 'Archived Chats',
        content: <ArchivedChats />,
      },
    }),
    []
  );

  return (
    <SettingsTabWrapper
      className={classNames(s.settingGeneral, [className])}
      mainRoute="general"
      routesData={data}
      route={route}
      onChangeRoute={setRoute}
    />
  );
});
