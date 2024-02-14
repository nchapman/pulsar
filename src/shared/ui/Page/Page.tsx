import { ReactNode } from 'preact/compat';
import { classNames } from '@/shared/lib/func';
import cls from './Page.module.scss';

interface PageProps {
  className?: string;
  children: ReactNode;
}

export const Page = (props: PageProps) => {
  const { className, children } = props;

  return <div className={classNames(cls.page, [className])}>{children}</div>;
};
