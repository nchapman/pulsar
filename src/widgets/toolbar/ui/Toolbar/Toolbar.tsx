import { memo } from 'preact/compat';
import { createPortal } from 'react';

import SidebarIcon from '@/shared/assets/icons/sidebar.svg';
import { classNames } from '@/shared/lib/func';
import { Button } from '@/shared/ui';
import { useFullscreen } from '@/widgets/toolbar/model/lib/trackFullscreen.ts';

import s from './Toolbar.module.scss';

interface Props {
  className?: string;
  onToggleSidebar: () => void;
}

export const Toolbar = memo((props: Props) => {
  const { className, onToggleSidebar } = props;
  const { fullscreen } = useFullscreen();

  return createPortal(
    <div className={classNames(s.toolbar, [className], { [s.fullscreen]: fullscreen })}>
      <Button onClick={onToggleSidebar} variant="clear" className={s.button} icon={SidebarIcon} />
    </div>,
    document.querySelector('#toolbar')!
  );
});
