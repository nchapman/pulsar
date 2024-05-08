import { memo } from 'preact/compat';

import SidebarIcon from '@/shared/assets/icons/sidebar.svg';
import { classNames } from '@/shared/lib/func';
import { Button } from '@/shared/ui';

import s from './ToolbarMacOS.module.scss';

interface Props {
  className?: string;
  onToggleSidebar: () => void;
}

export const ToolbarMacOS = memo((props: Props) => {
  const { className, onToggleSidebar } = props;

  return (
    <div className={classNames(s.toolbarMacOs, [className])}>
      <Button onClick={onToggleSidebar} variant="clear" className={s.button} icon={SidebarIcon} />
    </div>
  );
});
