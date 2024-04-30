import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { LeftPanel } from '@/shared/ui';

import { appDataDir } from '@tauri-apps/api/path';
import { open as openPath } from '@tauri-apps/api/shell';
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
        <button className={s.debug} onClick={openAppData}>
          Open App Data
        </button>
      )}
    </LeftPanel>
  );
});
