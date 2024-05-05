import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
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

  return (
    <LeftPanel
      open={open}
      className={classNames(s.panel, [className])}
      contentClassName={s.sidebar}
    >
      <ChatHistory className={s.chatHistory} />
      <SidebarFooter className={s.sidebarFooter} />
    </LeftPanel>
  );
});
