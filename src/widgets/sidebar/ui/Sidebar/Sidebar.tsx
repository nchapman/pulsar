import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { LeftPanel } from '@/shared/ui';
import { $chatHistoryKey } from '@/widgets/sidebar/model/sidebar.model.ts';

import { ChatHistory } from '../ChatHistory/ChatHistory.tsx';
import { SidebarFooter } from '../SidebarFooter/SidebarFooter.tsx';
import s from './Sidebar.module.scss';

interface Props {
  className?: string;
  open: boolean;
}

export const Sidebar = memo((props: Props) => {
  const { className, open } = props;

  const chatHistoryKey = useUnit($chatHistoryKey);

  return (
    <LeftPanel
      open={open}
      className={classNames(s.panel, [className])}
      contentClassName={s.sidebar}
    >
      <ChatHistory key={chatHistoryKey} className={s.chatHistory} />
      <SidebarFooter className={s.sidebarFooter} />
    </LeftPanel>
  );
});
