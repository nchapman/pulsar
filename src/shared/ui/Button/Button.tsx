/* eslint-disable react/button-has-type */
import { ComponentChild } from 'preact';
import { FC, memo, ReactNode, SVGProps } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Icon, Spinner } from '@/shared/ui';

import s from './Button.module.scss';

// @ts-ignore
interface ButtonProps {
  icon?: FC<SVGProps<SVGSVGElement>> | any;
  className?: string;
  children?: ComponentChild | any;
  variant: 'primary' | 'secondary' | 'link' | 'clear';
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  iconSize?: number;
  active?: boolean;
  full?: boolean;
  disabled?: boolean;
  activeSuffix?: ReactNode;
  onClick?: () => void;
}

export const Button = memo((props: ButtonProps) => {
  const {
    className,
    icon,
    iconSize,
    children,
    active,
    full,
    activeSuffix,
    variant,
    loading,
    ...otherProps
  } = props;

  const content = icon ? <Icon Svg={icon} size={iconSize} /> : children;

  const activeSuffixContent = (
    <div onClick={(e) => e.stopPropagation()} className={s.suffix}>
      {activeSuffix}
    </div>
  );

  return (
    <button
      {...otherProps}
      className={classNames(s.button, [s[variant], className], {
        [s.icon]: !!icon,
        [s.full]: full,
        [s.active]: active,
        [s.loading]: loading,
      })}
      disabled={props.disabled || loading}
    >
      {content}
      {loading && <Spinner className={s.spinner} />}
      {activeSuffix && activeSuffixContent}
    </button>
  );
});
