import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Title } from '@/shared/ui';

import s from './Navbar.module.scss';

interface Props {
  className?: string;
}

export const Navbar = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.navbar, [className])}>
      <Title className={s.title} level={1}>
        Pulsar 1.0
      </Title>
    </div>
  );
});
