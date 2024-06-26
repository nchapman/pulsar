import { invoke } from '@tauri-apps/api';
import { appDataDir } from '@tauri-apps/api/path';
import { open as openPath } from '@tauri-apps/api/shell';
import { memo } from 'preact/compat';
import { error } from 'tauri-plugin-log';
import Database from 'tauri-plugin-sql-api';

import { __IS_STORYBOOK__ } from '@/shared/consts';
import { classNames } from '@/shared/lib/func';
import { Button } from '@/shared/ui';
import { openSettingsModal, SettingsModal } from '@/widgets/settings';

import s from './SidebarFooter.module.scss';

interface Props {
  className?: string;
}

export const SidebarFooter = memo((props: Props) => {
  const { className } = props;

  const openAppData = async () => {
    const appDataDirPath = await appDataDir();
    openPath(appDataDirPath);
  };

  const testSqliteVec = async () => {
    const path = 'sqlite:vec.db';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const db = await Database.load(path);

    try {
      await invoke('plugin:sql|test_sqlite_vec', {
        db: path,
      });
    } catch (e) {
      error(`${e}`);
    }
  };

  return (
    <div className={classNames(s.sidebarFooter, [className])}>
      {import.meta.env.DEV &&
        import.meta.env.VITE_PULSAR_SHOW_DEV_MENU === 'true' &&
        !__IS_STORYBOOK__ && (
          <>
            <Button className={s.btn} onClick={openAppData} variant="secondary">
              Open App Data
            </Button>
            <Button className={s.btn} onClick={testSqliteVec} variant="secondary">
              Test SQLite Vec
            </Button>
          </>
        )}

      <Button className={s.btn} onClick={openSettingsModal} variant="secondary">
        Settings
      </Button>

      <SettingsModal />
    </div>
  );
});
