import { memo } from 'preact/compat';

import { SwitchModelInsideChat } from '@/entities/model/ui/SwitchModelInsideChat/SwitchModelInsideChat.tsx';
import { classNames } from '@/shared/lib/func';

import s from './Navbar.module.scss';

interface Props {
  className?: string;
}

export const Navbar = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.navbar, [className])}>
      <SwitchModelInsideChat />
    </div>
  );
});
