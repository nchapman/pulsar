import { useUnit } from 'effector-react';

import { DEFAULT_LLM, useModelReady } from '@/entities/model';
import { Page } from '@/shared/ui';
import { Chat } from '@/widgets/chat';
import { Navbar } from '@/widgets/navbar';
import { Sidebar } from '@/widgets/sidebar';
import { WelcomeScreen } from '@/widgets/welcome-screen';

import { $sidebarOpened } from '../../model/chat.ts';
import s from './ChatPage.module.scss';

export const ChatPage = () => {
  const sidebarOpened = useUnit($sidebarOpened);

  const { ready, checkModelExists, mmmExists, llmExists } = useModelReady(DEFAULT_LLM);

  if (ready === false) {
    return <div>Failed to load model! Contact support</div>;
  }

  const mainContent = (
    <>
      <Navbar />
      <Chat />
    </>
  );

  function getContent() {
    if (!llmExists || !mmmExists)
      return <WelcomeScreen model={DEFAULT_LLM} onLoaded={checkModelExists} />;
    return mainContent;
  }

  return (
    <Page className={s.chatPage}>
      <Sidebar open={sidebarOpened} className={s.sidebar} />

      <main className={s.main}>{getContent()}</main>
    </Page>
  );
};
