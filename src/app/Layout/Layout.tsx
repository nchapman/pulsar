import { useUnit } from 'effector-react';
import { FC, memo } from 'preact/compat';

import { $currRoute, Route } from '@/app/routes';
import { Page } from '@/shared/ui';
import { Chat, ChatNavbar } from '@/widgets/chat';
import { DownloadsNavbar, DownloadsPage } from '@/widgets/downloads';
import { ModelsDetailsPage, ModelsSearchPage, ModelStoreNavbar } from '@/widgets/model-store';
import { Navbar } from '@/widgets/navbar';
import { $sidebarOpened, Sidebar, toggleSidebar } from '@/widgets/sidebar';
import { Toolbar } from '@/widgets/toolbar';

import s from './Layout.module.scss';

const Widgets: Record<Route, FC> = {
  [Route.Chat]: Chat,
  [Route.Store]: ModelsSearchPage,
  [Route.StoreModel]: ModelsDetailsPage,
  [Route.Downloads]: DownloadsPage,
};

const Nav: Record<Route, FC> = {
  [Route.Chat]: ChatNavbar,
  [Route.Store]: ModelStoreNavbar,
  [Route.StoreModel]: ModelStoreNavbar,
  [Route.Downloads]: DownloadsNavbar,
};

export const Layout = memo(() => {
  const sidebarOpened = useUnit($sidebarOpened);
  const route = useUnit($currRoute);
  const Widget = Widgets[route];
  const WidgetNav = Nav[route];

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
    </Page>
  );
});
