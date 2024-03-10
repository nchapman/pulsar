import { memo, ReactNode } from 'preact/compat';

import { classNames } from '@/shared/lib/func';

import s from './Card.module.scss';

interface Props {
  className?: string;
  children?: ReactNode;
}

export const Card = memo((props: Props) => {
  const { className, children } = props;

  return <div className={classNames(s.card, [className])}>{children}</div>;
});
