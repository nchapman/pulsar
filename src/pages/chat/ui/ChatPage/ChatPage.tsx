import { useUnit } from 'effector-react';

import { Page } from '@/shared/ui';
import { Chat } from '@/widgets/chat';
import { Navbar } from '@/widgets/navbar';
import { Sidebar } from '@/widgets/sidebar';
import { Toolbar } from '@/widgets/toolbar';

import { $sidebarOpened, toggleSidebar } from '../../model/chat.ts';
import s from './ChatPage.module.scss';

export const ChatPage = () => {
  const sidebarOpened = useUnit($sidebarOpened);

  return (
    <Page className={s.chatPage}>
      <Toolbar onToggleSidebar={toggleSidebar} />

      <Sidebar open={sidebarOpened} className={s.sidebar} />

      <main className={s.main}>
        <Navbar />
        <Chat />
      </main>
    </Page>
  );
};
