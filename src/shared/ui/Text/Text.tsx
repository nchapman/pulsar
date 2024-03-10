import { createElement, CSSProperties, memo, ReactNode } from 'preact/compat';

import { classNames } from '@/shared/lib/func';

import cls from './Text.module.scss';

interface TextProps {
  className?: string;
  children?: string | number | (string | number)[] | ReactNode;
  style?: CSSProperties;
  s?: number;
  c?: 'primary' | 'secondary';
  w?: 'bold' | 'semi' | 'normal' | 'medium';
}

export const Text = memo((props: TextProps) => {
  const { className, children, style, w = 'normal', c = 'secondary', s = 16 } = props;

  const textClass = classNames(cls.text, [className, cls[c], cls[w]]);

  if (children === undefined || children === null) return null;

  return createElement(
    'span',
    { className: textClass, style: { fontSize: s, ...style } },
    children
  );
});
