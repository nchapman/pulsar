import { os } from '@tauri-apps/api';
import { useUnit } from 'effector-react';
import { memo, ReactNode } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';

import { classNames } from '@/shared/lib/func';
import { $sidebarOpened } from '@/widgets/sidebar';

import s from './Navbar.module.scss';

interface Props {
  className?: string;
  children?: ReactNode;
}

export const Navbar = memo((props: Props) => {
  const { className, children } = props;
  const sidebarOpened = useUnit($sidebarOpened);

  const [osType, setOsType] = useState<os.OsType>();

  useEffect(() => {
    os.type().then(setOsType);
  }, []);

  return (
    <div
      className={classNames(s.navbar, [className], {
        [s.collapsed]: !sidebarOpened,
        [s.mac]: osType === 'Darwin',
      })}
    >
      <div className={s.inner}>{children}</div>
    </div>
  );
});
