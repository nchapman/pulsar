/* eslint-disable react/button-has-type */
import { FC, memo, SVGProps } from 'preact/compat';

import { ComponentChild } from 'preact';
import { classNames } from '@/shared/lib/func';
import { Icon } from '@/shared/ui';
import cls from './Button.module.scss';

// @ts-ignore
interface ButtonProps {
  icon?: FC<SVGProps<SVGSVGElement>>;
  className?: string;
  children?: ComponentChild | any;
  type?: 'clear' | 'outlined' | 'primary' | 'secondary';
  iconSize?: number;
  htmlType?: 'button' | 'submit' | 'reset';
  full?: boolean;
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
    full,
    ...otherProps
  } = props;

  return (
    <button
      type={htmlType}
      {...otherProps}
      className={classNames(cls.button, [cls[type], className], {
        [cls.icon]: !!icon,
        [cls.full]: full,
      })}
    >
      {icon ? <Icon Svg={icon} size={iconSize} /> : children}
    </button>
  );
});
