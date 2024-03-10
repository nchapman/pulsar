import { memo, ReactNode } from 'preact/compat';

import { classNames } from '@/shared/lib/func';

import s from './Title.module.scss';

interface Props {
  className?: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children?: ReactNode;
}

export const Title = memo((props: Props) => {
  const { className, level, children } = props;

  const Tag = `h${level}` as any;

  return <Tag className={classNames(s.title, [className, s[Tag]])}>{children}</Tag>;
});
