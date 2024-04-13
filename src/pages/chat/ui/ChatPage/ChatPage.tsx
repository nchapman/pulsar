import { useUnit } from 'effector-react';

import { defaultModel, useModelReady } from '@/entities/model';
import { Page } from '@/shared/ui';
import { Chat } from '@/widgets/chat';
import { Navbar } from '@/widgets/navbar';
import { Sidebar } from '@/widgets/sidebar';
import { WelcomeScreen } from '@/widgets/welcome-screen';

import { $sidebarOpened } from '../../model/chat.ts';
import s from './ChatPage.module.scss';

export const ChatPage = () => {
  const { ready, handleLoaded } = useModelReady(defaultModel);
  const sidebarOpened = useUnit($sidebarOpened);

  const chatContent = (
    <>
      <Navbar />
      <Chat />
    </>
  );

  return (
    <Page className={s.chatPage}>
      <Sidebar open={sidebarOpened} className={s.sidebar} />

      <main className={s.main}>
        {ready ? chatContent : <WelcomeScreen onLoaded={handleLoaded} />}
      </main>
    </Page>
  );
};
