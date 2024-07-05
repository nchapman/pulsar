import { memo, ReactNode } from 'preact/compat';

import { classNames } from '@/shared/lib/func';

import s from './Navbar.module.scss';

interface Props {
  className?: string;
  children?: ReactNode;
}

export const Navbar = memo((props: Props) => {
  const { className, children } = props;

  return <div className={classNames(s.navbar, [className])}>{children}</div>;
});
