import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import SidebarIcon from '@/shared/assets/icons/sidebar.svg';
import { classNames } from '@/shared/lib/func';
import { Button } from '@/shared/ui';
import { $isFullscreen } from '@/widgets/toolbar/model/fullscreen.model.ts';

import s from './ToolbarMacOS.module.scss';

interface Props {
  className?: string;
  onToggleSidebar?: () => void;
}

export const ToolbarMacOS = memo((props: Props) => {
  const { className, onToggleSidebar } = props;
  const isFullscreen = useUnit($isFullscreen);

  return (
    <div
      data-tauri-drag-region
      className={classNames(s.toolbarMacOs, [className], { [s.fullscreen]: isFullscreen })}
    >
      {onToggleSidebar && (
        <Button onClick={onToggleSidebar} variant="clear" className={s.button} icon={SidebarIcon} />
      )}
    </div>
  );
});
