import { memo, ReactNode } from 'preact/compat';

import { classNames } from '@/shared/lib/func';

import s from './Card.module.scss';

interface Props {
  className?: string;
  children?: ReactNode;
  type?: 'primary' | 'secondary';
  size?: 's' | 'm' | 'l';
}

export const Card = memo((props: Props) => {
  const { className, children, size = 'm', type = 'primary' } = props;

  return <div className={classNames(s.card, [className, s[size], s[type]])}>{children}</div>;
});
