import { Page, Sidebar } from '@/shared/ui';
import { Chat } from '@/widgets/chat';
import s from './ChatPage.module.scss';
import { Navbar } from '@/widgets/navbar';

export const ChatPage = () => (
  <Page className={s.chatPage}>
    <Sidebar className={s.sidebar}>
      <div />
    </Sidebar>

    <main className={s.main}>
      <Navbar className={s.navbar} />
      <Chat />
    </main>
  </Page>
);
