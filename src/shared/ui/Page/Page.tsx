import { ReactNode } from 'preact/compat';
import { classNames } from '@/shared/lib/func';
import s from './Page.module.scss';

interface PageProps {
  className?: string;
  children: ReactNode;
}

export const Page = (props: PageProps) => {
  const { className, children } = props;

  return <div className={classNames(s.page, [className])}>{children}</div>;
};
