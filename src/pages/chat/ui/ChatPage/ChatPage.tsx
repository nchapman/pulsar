import { Page } from '@/shared/ui';
import { Chat } from '@/widgets/chat';
import { Navbar } from '@/widgets/navbar';
import { Sidebar } from '@/widgets/sidebar';

import s from './ChatPage.module.scss';

export const ChatPage = () => (
  <Page className={s.chatPage}>
    <Sidebar className={s.sidebar} />

    <main className={s.main}>
      <Navbar className={s.navbar} />
      <Chat />
    </main>
  </Page>
);
