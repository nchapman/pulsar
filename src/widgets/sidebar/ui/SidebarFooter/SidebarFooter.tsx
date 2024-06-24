import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { $currRoute, goToDownloads, goToStore, Route } from '@/app/routes';
import { classNames } from '@/shared/lib/func';
import { Button, Icon } from '@/shared/ui';
import { openSettingsModal, SettingsModal } from '@/widgets/settings';

import StoreIcon from '../../assets/container.svg';
import DownloadsIcon from '../../assets/download.svg';
import SettingsIcon from '../../assets/settings.svg';
import s from './SidebarFooter.module.scss';

interface Props {
  className?: string;
}

export const SidebarFooter = memo((props: Props) => {
  const { className } = props;
  const currRoute = useUnit($currRoute);

  return (
    <div className={classNames(s.sidebarFooter, [className])}>
      <Button
        className={s.btn}
        onClick={goToStore}
        variant="clear"
        active={[Route.Store, Route.StoreModel].includes(currRoute)}
        withInactive
      >
        <Icon svg={StoreIcon} className={s.icon} />
        Store
      </Button>
      <Button className={s.btn} onClick={openSettingsModal} variant="clear" withInactive>
        <Icon svg={SettingsIcon} className={s.icon} />
        Settings
      </Button>
      <Button
        className={s.btn}
        onClick={goToDownloads}
        variant="clear"
        active={currRoute === Route.Downloads}
        withInactive
      >
        <Icon svg={DownloadsIcon} className={s.icon} />
        Downloads
      </Button>

      <SettingsModal />
    </div>
  );
});
