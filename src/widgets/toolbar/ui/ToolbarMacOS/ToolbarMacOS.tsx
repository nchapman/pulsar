import { appWindow } from '@tauri-apps/api/window';
import { createEvent, createStore } from 'effector';
import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import SidebarIcon from '@/shared/assets/icons/sidebar.svg';
import { classNames } from '@/shared/lib/func';
import { Button } from '@/shared/ui';

import s from './ToolbarMacOS.module.scss';

interface Props {
  className?: string;
  onToggleSidebar: () => void;
}

const $isFullscreen = createStore(false);
const setIsFullscreen = createEvent<boolean>();
$isFullscreen.on(setIsFullscreen, (_, payload) => payload);

appWindow.onResized(() => {
  appWindow.isFullscreen().then(setIsFullscreen);
});
appWindow.isFullscreen().then(setIsFullscreen);

export const ToolbarMacOS = memo((props: Props) => {
  const { className, onToggleSidebar } = props;
  const isFullscreen = useUnit($isFullscreen);

  return (
    <div className={classNames(s.toolbarMacOs, [className], { [s.fullscreen]: isFullscreen })}>
      <Button onClick={onToggleSidebar} variant="clear" className={s.button} icon={SidebarIcon} />
    </div>
  );
});
