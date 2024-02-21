import { Page } from '@/shared/ui';
import { Chat } from '@/widgets/chat';
import s from './ChatPage.module.scss';
import { Navbar } from '@/widgets/navbar';

export const ChatPage = () => (
  <Page className={s.chatPage}>
    <Navbar className={s.navbar} />
    <Chat />
  </Page>
);
