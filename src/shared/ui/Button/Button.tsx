/* eslint-disable react/button-has-type */
import { FC, memo, SVGProps } from 'preact/compat';

import { ComponentChild } from 'preact';
import { classNames } from '@/shared/lib/func';
import { Icon } from '@/shared/ui';
import cls from './Button.module.scss';

// @ts-ignore
// eslint-disable-next-line no-undef
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  icon?: FC<SVGProps<SVGSVGElement>>;
  className?: string;
  children?: ComponentChild | any;
  type?: 'clear' | 'outlined' | 'primary' | 'secondary';
  iconSize?: number;
  // @ts-ignore
  // eslint-disable-next-line no-undef
  htmlType?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  full?: boolean;
  inverted?: boolean;
}

export const Button = memo((props: ButtonProps) => {
  const {
    className,
    icon,
    iconSize,
    children,
    htmlType = 'button',
    type = 'outlined',
    inverted,
    full,
    ...otherProps
  } = props;

  return (
    // @ts-ignore
    <button
      type={htmlType}
      {...otherProps}
      className={classNames(cls.button, [cls[type], className], {
        [cls.icon]: !!icon,
        [cls.full]: full,
        [cls.inverted]: inverted,
      })}
    >
      {icon ? <Icon Svg={icon} size={iconSize} /> : children}
    </button>
  );
});
