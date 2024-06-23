import { useUnit } from 'effector-react';
import { FC, memo } from 'preact/compat';

import { $currRoute, Route } from '@/app/routes';
import { Page } from '@/shared/ui';
import { Chat, ChatNavbar } from '@/widgets/chat';
import { ModelsDetailsPage, ModelsSearchPage } from '@/widgets/model-store';
import { Navbar } from '@/widgets/navbar';
import { $sidebarOpened, Sidebar, toggleSidebar } from '@/widgets/sidebar';
import { Toolbar } from '@/widgets/toolbar';

import s from './Layout.module.scss';

const Widgets: Record<Route, FC> = {
  [Route.Chat]: Chat,
  [Route.Store]: ModelsSearchPage,
  [Route.StoreModel]: ModelsDetailsPage,
  [Route.Downloads]: Chat,
};

const Nav: Record<Route, FC> = {
  [Route.Chat]: ChatNavbar,
  [Route.Store]: () => null,
  [Route.StoreModel]: () => null,
  [Route.Downloads]: () => null,
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
