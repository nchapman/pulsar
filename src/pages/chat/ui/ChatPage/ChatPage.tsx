import { useUnit } from 'effector-react';
import { useMemo } from 'preact/hooks';

import { DEFAULT_LLM } from '@/entities/model';
import {
  $hasCheckedModels,
  $modelLoadError,
  $modelReady,
} from '@/entities/model/model/manage-models-model.ts';
import { Page } from '@/shared/ui';
import { Chat } from '@/widgets/chat';
import { Navbar } from '@/widgets/navbar';
import { Sidebar } from '@/widgets/sidebar';
import { WelcomeScreen } from '@/widgets/welcome-screen';

import { $sidebarOpened } from '../../model/chat.ts';
import s from './ChatPage.module.scss';

export const ChatPage = () => {
  const sidebarOpened = useUnit($sidebarOpened);

  const ready = useUnit($modelReady);
  const hasCheckedModels = useUnit($hasCheckedModels);
  const modelLoadError = useUnit($modelLoadError);

  const content = useMemo(() => {
    if (modelLoadError) return <div>Failed to load model! Contact support</div>;

    if (!ready && hasCheckedModels) return <WelcomeScreen model={DEFAULT_LLM} />;

    return (
      <>
        <Navbar />
        <Chat />
      </>
    );
  }, [hasCheckedModels, modelLoadError, ready]);

  return (
    <Page className={s.chatPage}>
      <Sidebar open={sidebarOpened} className={s.sidebar} />

      <main className={s.main}>{content}</main>
    </Page>
  );
};
