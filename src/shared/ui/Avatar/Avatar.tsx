import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';

import s from './Avatar.module.scss';

interface Props {
  className?: string;
  src: string;
  name?: string;
  size: number;
}

export const Avatar = memo((props: Props) => {
  const { className, src, name, size } = props;

  return (
    <div className={classNames(s.avatar, [className])} style={{ width: size, height: size }}>
      <img src={src} alt={name || 'user'} />
    </div>
  );
});
