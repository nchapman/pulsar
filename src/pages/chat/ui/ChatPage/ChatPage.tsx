import { Page } from '@/shared/ui';
import { Chat } from '@/widgets/chat';
import { Navbar } from '@/widgets/navbar';
import { Sidebar } from '@/widgets/sidebar';
import { WelcomeScreen } from '@/widgets/welcome-screen';

import { useChatReady } from '../../hooks/useChatReady.ts';
import s from './ChatPage.module.scss';

export const ChatPage = () => {
  const { ready, handleLoaded } = useChatReady();

  return (
    <Page className={s.chatPage}>
      <Sidebar className={s.sidebar} />

      <main className={s.main}>
        {ready ? (
          <>
            <Navbar />
            <Chat />
          </>
        ) : (
          <WelcomeScreen onLoaded={handleLoaded} />
        )}
      </main>
    </Page>
  );
};
