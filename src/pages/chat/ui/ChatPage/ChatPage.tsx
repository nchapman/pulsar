import { Page } from '@/shared/ui';
import { Chat } from '@/widgets/chat';
import s from './ChatPage.module.scss';

export const ChatPage = () => (
  <Page className={s.chatPage}>
    <Chat />
  </Page>
);
