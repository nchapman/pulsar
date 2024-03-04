import { memo } from 'preact/compat';

import LogoIcon from '@/shared/assets/imgs/logo.png';
import { classNames } from '@/shared/lib/func';

import s from './Logo.module.scss';

interface Props {
  className?: string;
}

export const Logo = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.logo, [className])}>
      <img src={LogoIcon} alt="logo" />
    </div>
  );
});
