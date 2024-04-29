import { useUnit } from 'effector-react';
import { useMemo } from 'preact/hooks';

import { DEFAULT_LLM } from '@/entities/model';
import { $missingModel, $modelLoadError } from '@/entities/model/model/manage-models-model.ts';
import { Page } from '@/shared/ui';
import { Chat } from '@/widgets/chat';
import { Navbar } from '@/widgets/navbar';
import { Sidebar } from '@/widgets/sidebar';
import { WelcomeScreen } from '@/widgets/welcome-screen';

import { $sidebarOpened } from '../../model/chat.ts';
import s from './ChatPage.module.scss';

export const ChatPage = () => {
  const sidebarOpened = useUnit($sidebarOpened);

  const missingModel = useUnit($missingModel);
  const modelLoadError = useUnit($modelLoadError);

  const content = useMemo(() => {
    if (modelLoadError) return <div>Failed to load model! Contact support</div>;

    if (missingModel) return <WelcomeScreen model={DEFAULT_LLM} />;

    return (
      <>
        <Navbar />
        <Chat />
      </>
    );
  }, [missingModel, modelLoadError]);

  return (
    <Page className={s.chatPage}>
      <Sidebar open={sidebarOpened} className={s.sidebar} />

      <main className={s.main}>{content}</main>
    </Page>
  );
};
