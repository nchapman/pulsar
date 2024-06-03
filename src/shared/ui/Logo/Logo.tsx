import { memo } from 'preact/compat';

import LogoIcon from '@/shared/assets/icons/logo.svg';
import { classNames } from '@/shared/lib/func';
import { Icon } from '@/shared/ui';

import s from './Logo.module.scss';

interface Props {
  className?: string;
  size: 's' | 'm' | 'l' | 'xl';
}

export const Logo = memo((props: Props) => {
  const { className, size } = props;

  return (
    <div className={classNames(s.logo, [className, s[size]])}>
      <Icon className={s[size]} svg={LogoIcon} />
    </div>
  );
});
