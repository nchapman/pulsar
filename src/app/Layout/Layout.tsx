import { useUnit } from 'effector-react';
import { FC, memo, useLayoutEffect } from 'preact/compat';

import { $currRoute, Route } from '@/app/routes';
import { Page } from '@/shared/ui';
import { AgentsPage } from '@/widgets/agents/ui/AgentsPage/AgentsPage.tsx';
import { Chat, ChatNavbar } from '@/widgets/chat';
import { DownloadsNavbar, DownloadsPage } from '@/widgets/downloads';
import { ModelSettings, ModelSettingsSwitch } from '@/widgets/model-settings';
import { ModelsDetailsPage, ModelsSearchPage, ModelStoreNavbar } from '@/widgets/model-store';
import { Navbar } from '@/widgets/navbar';
import { restoreWindowSize } from '@/widgets/onboarding';
import { $sidebarOpened, Sidebar, toggleSidebar } from '@/widgets/sidebar';
import { Toolbar } from '@/widgets/toolbar';

import s from './Layout.module.scss';

const Widgets: Record<Route, FC> = {
  [Route.Chat]: Chat,
  [Route.Store]: ModelsSearchPage,
  [Route.StoreSearch]: ModelsSearchPage,
  [Route.StoreModel]: ModelsDetailsPage,
  [Route.Downloads]: DownloadsPage,
  [Route.Agents]: AgentsPage,
};

const Nav: Record<Route, FC> = {
  [Route.Chat]: ChatNavbar,
  [Route.Store]: ModelStoreNavbar,
  [Route.StoreSearch]: ModelStoreNavbar,
  [Route.StoreModel]: ModelStoreNavbar,
  [Route.Downloads]: DownloadsNavbar,
  [Route.Agents]: () => null,
};

export const Layout = memo(() => {
  const sidebarOpened = useUnit($sidebarOpened);
  const route = useUnit($currRoute);
  const Widget = Widgets[route];
  const WidgetNav = Nav[route];

  useLayoutEffect(() => {
    restoreWindowSize();
  }, []);

  return (
    <Page className={s.layout}>
      <Toolbar onToggleSidebar={toggleSidebar} />

      <Sidebar open={sidebarOpened} className={s.sidebar} />

      <main className={s.main}>
        <Navbar>
          <WidgetNav />
        </Navbar>

        <Widget />
      </main>

      <ModelSettings className={s.modelSettings} />
      <ModelSettingsSwitch className={s.modelSettingsSwitch} />
    </Page>
  );
});
