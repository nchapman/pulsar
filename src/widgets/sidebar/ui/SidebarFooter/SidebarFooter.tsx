import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';

import s from './SidebarFooter.module.scss';

interface Props {
  className?: string;
}

export const SidebarFooter = memo((props: Props) => {
  const { className } = props;

  return <div className={classNames(s.sidebarFooter, [className])}></div>;
});
