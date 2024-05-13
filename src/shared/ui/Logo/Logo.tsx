import { memo } from 'preact/compat';

import LogoIcon from '@/shared/assets/imgs/logo.png';
import { classNames } from '@/shared/lib/func';

import s from './Logo.module.scss';

interface Props {
  className?: string;
  size: 's' | 'm' | 'l';
}

export const Logo = memo((props: Props) => {
  const { className, size } = props;

  return (
    <div className={classNames(s.logo, [className, s[size]])}>
      <img src={LogoIcon} alt="logo" />
    </div>
  );
});
