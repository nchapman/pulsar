import { memo } from 'preact/compat';
import { classNames } from '@/shared/lib/func';
import s from './Sidebar.module.scss';
import { LeftPanel } from '@/shared/ui';
import { SidebarFooter } from '../SidebarFooter/SidebarFooter.tsx';
import { ChatHistory } from '../ChatHistory/ChatHistory.tsx';

interface Props {
  className?: string;
}

export const Sidebar = memo((props: Props) => {
  const { className } = props;

  return (
    <LeftPanel className={classNames(s.panel, [className])} contentClassName={s.sidebar}>
      <ChatHistory className={s.chatHistory} />
      <SidebarFooter className={s.sidebarFooter} />
    </LeftPanel>
  );
});
