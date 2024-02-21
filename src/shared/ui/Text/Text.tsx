import { CSSProperties, createElement, memo, ReactNode } from 'preact/compat';
import { classNames } from '@/shared/lib/func';
import cls from './Text.module.scss';

type textType =
  | 'body-1'
  | 'body-2'
  | 'body-3'
  | 'body-4'
  | 'subtitle-1'
  | 'subtitle-2'
  | 'subtitle-3'
  | 'subtitle-4'
  | 'subtitle-5'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'heading-5'
  | 'heading-6'
  | 'link-1'
  | 'link-2'
  | 'link-3';

interface TextProps {
  className?: string;
  children?: string | number | (string | number)[] | ReactNode;
  type: textType;
  align?: 'right' | 'left' | 'center';
  style?: CSSProperties;
  isTitle?: boolean;
  brand?: boolean;
}

export const Text = memo((props: TextProps) => {
  const { className, children, type, align = 'left', style, isTitle, brand } = props;

  const textClass = classNames('text', [className, cls[align], cls[type]]);

  if (children === undefined || children === null) return null;

  return createElement(
    'span',
    { className: classNames(textClass, [], { [cls.title]: isTitle, [cls.brand]: brand }), style },
    children
  );
});
