import { useModelReady } from '@/entities/model';
import { Page } from '@/shared/ui';
import { Chat } from '@/widgets/chat';
import { Navbar } from '@/widgets/navbar';
import { Sidebar } from '@/widgets/sidebar';
import { WelcomeScreen } from '@/widgets/welcome-screen';

import s from './ChatPage.module.scss';

export const ChatPage = () => {
  const { ready, handleLoaded } = useModelReady();

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
