import { appWindow } from '@tauri-apps/api/window';
import { memo } from 'preact/compat';

import SidebarIcon from '@/shared/assets/icons/sidebar.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Text } from '@/shared/ui';
import CloseIcon from '@/widgets/toolbar/assets/close.svg';
import MaximizeIcon from '@/widgets/toolbar/assets/maximize.svg';
import MinimizeIcon from '@/widgets/toolbar/assets/minimize.svg';

import s from './ToolbarWindows.module.scss';

interface Props {
  className?: string;
  onToggleSidebar: () => void;
}

export const ToolbarWindows = memo((props: Props) => {
  const { className, onToggleSidebar } = props;

  return (
    <div className={classNames(s.toolbarWindows, [className])}>
      <Button onClick={onToggleSidebar} variant="clear" className={s.button} icon={SidebarIcon} />

      <Text c="secondary" w="medium" s={14} className={s.title}>
        Pulsar
      </Text>

      <div className={s.controls}>
        <Button
          variant="clear"
          className={s.button}
          icon={MinimizeIcon}
          iconSize={16}
          onClick={() => appWindow.minimize()}
        />
        <Button
          variant="clear"
          className={s.button}
          icon={MaximizeIcon}
          iconSize={16}
          onClick={() => appWindow.toggleMaximize()}
        />
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
