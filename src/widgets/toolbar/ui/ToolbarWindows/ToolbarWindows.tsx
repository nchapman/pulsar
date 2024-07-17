import { appWindow } from '@tauri-apps/api/window';
import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import SidebarIcon from '@/shared/assets/icons/sidebar.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Text } from '@/shared/ui';
import { $isResizable } from '@/widgets/onboarding/lib/window-size.ts';
import CloseIcon from '@/widgets/toolbar/assets/close.svg';
import MaximizeIcon from '@/widgets/toolbar/assets/maximize.svg';
import MinimizeIcon from '@/widgets/toolbar/assets/minimize.svg';

import s from './ToolbarWindows.module.scss';

interface Props {
  className?: string;
  onToggleSidebar?: () => void;
}

export const ToolbarWindows = memo((props: Props) => {
  const { className, onToggleSidebar } = props;

  const isResizable = useUnit($isResizable);

  return (
    <div data-tauri-drag-region className={classNames(s.toolbarWindows, [className])}>
      {onToggleSidebar && (
        <Button onClick={onToggleSidebar} variant="clear" className={s.button} icon={SidebarIcon} />
      )}

      <Text c="secondary" w="medium" s={14} className={s.title}></Text>

      <div className={s.controls}>
        <Button
          variant="clear"
          className={s.button}
          icon={MinimizeIcon}
          iconSize={16}
          onClick={() => appWindow.minimize()}
        />
        {isResizable && (
          <Button
            variant="clear"
            className={s.button}
            icon={MaximizeIcon}
            iconSize={16}
            onClick={() => appWindow.toggleMaximize()}
          />
        )}
        <Button
          variant="clear"
          className={s.button}
          icon={CloseIcon}
          iconSize={16}
          onClick={() => appWindow.close()}
        />
      </div>
    </div>
  );
});
