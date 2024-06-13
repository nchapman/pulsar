import { useUnit } from 'effector-react';
import { useEffect } from 'preact/hooks';

import { $widget, Widgets } from '@/pages/chat/model/widgets.ts';
import { restoreWindowSize } from '@/pages/onboarding/lib/window-size.ts';
import { Page } from '@/shared/ui';
import { Chat } from '@/widgets/chat';
import { ModelStore } from '@/widgets/model-store';
import { Navbar } from '@/widgets/navbar';
import { Sidebar } from '@/widgets/sidebar';
import { Toolbar } from '@/widgets/toolbar';

import { $sidebarOpened, toggleSidebar } from '../../model/chat.ts';
import s from './ChatPage.module.scss';

const WidgetComponent = {
  [Widgets.CHAT]: Chat,
  [Widgets.MODEL_STORE]: ModelStore,
};

export const ChatPage = () => {
  const sidebarOpened = useUnit($sidebarOpened);
  const widget = useUnit($widget);
  const W = WidgetComponent[widget];

  useEffect(() => {
    restoreWindowSize();
  }, []);

  return (
    <Page className={s.chatPage}>
      <Toolbar onToggleSidebar={toggleSidebar} />

      <Sidebar open={sidebarOpened} className={s.sidebar} />

      <main className={s.main}>
        <Navbar />
        <W />
      </main>
    </Page>
  );
};
