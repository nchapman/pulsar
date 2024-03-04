/* eslint-disable react/button-has-type */
import { ComponentChild } from 'preact';
import { FC, memo, ReactNode, SVGProps } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Icon } from '@/shared/ui';

import s from './Button.module.scss';

// @ts-ignore
interface ButtonProps {
  icon?: FC<SVGProps<SVGSVGElement>> | any;
  className?: string;
  children?: ComponentChild | any;
  type?: 'clear' | 'outlined' | 'primary' | 'secondary';
  iconSize?: number;
  htmlType?: 'button' | 'submit' | 'reset';
  active?: boolean;
  full?: boolean;
  activeSuffix?: ReactNode;
  onClick?: () => void;
}

export const Button = memo((props: ButtonProps) => {
  const {
    className,
    icon,
    iconSize,
    children,
    htmlType = 'button',
    type = 'outlined',
    active,
    full,
    activeSuffix,
    ...otherProps
  } = props;

  return (
    <button
      type={htmlType}
      {...otherProps}
      className={classNames(s.button, [s[type], className], {
        [s.icon]: !!icon,
        [s.full]: full,
        [s.active]: active,
      })}
    >
      {icon ? <Icon Svg={icon} size={iconSize} /> : children}
      {activeSuffix && (
        <div onClick={(e) => e.stopPropagation()} className={s.suffix}>
          {activeSuffix}
        </div>
      )}
    </button>
  );
});
