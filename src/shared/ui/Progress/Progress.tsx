import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';

import s from './Progress.module.scss';

interface Props {
  className?: string;
  percent: number;
}

export const Progress = memo((props: Props) => {
  const { className, percent } = props;

  return (
    <div className={classNames(s.progress, [className])}>
      <div className={s.bar}>
        <div className={s.inner} style={{ width: `${percent}%` }} />
      </div>

      <Text c="primary" s={14} className={s.percent}>
        {Math.floor(percent)}%
      </Text>
    </div>
  );
});
