import { open as openDialog } from '@tauri-apps/api/dialog';
import { appDataDir } from '@tauri-apps/api/path';
import { open as openPath } from '@tauri-apps/api/shell';
import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { logi } from '@/shared/lib/Logger.ts';
import { LeftPanel } from '@/shared/ui';

import { ChatHistory } from '../ChatHistory/ChatHistory.tsx';
import { SidebarFooter } from '../SidebarFooter/SidebarFooter.tsx';
import s from './Sidebar.module.scss';

interface Props {
  className?: string;
  open: boolean;
}

export const Sidebar = memo((props: Props) => {
  const { className, open } = props;

  const openAppData = async () => {
    const appDataDirPath = await appDataDir();
    openPath(appDataDirPath);
  };

  const scanDir = async () => {
    const directory = await openDialog({ directory: true });
    logi('Sidebar', directory);
    // const dialog = await window.Tauri.dialog.open({
    //   directory: true,
    // });
    // console.log(dialog);
  };

  return (
    <LeftPanel
      open={open}
      className={classNames(s.panel, [className])}
      contentClassName={s.sidebar}
    >
      <ChatHistory className={s.chatHistory} />
      <SidebarFooter className={s.sidebarFooter} />
      {/* @ts-ignore */}
      {process.env.NODE_ENV === 'development' && (
        <>
          {/* eslint-disable-next-line react/button-has-type */}
          <button className={s.debug} onClick={openAppData}>
            Open App Data
          </button>
          {/* eslint-disable-next-line react/button-has-type */}
          <button className={s.debug} onClick={scanDir}>
            Select scan dir
          </button>
        </>
      )}
    </LeftPanel>
  );
});
