import { memo } from 'preact/compat';

import PlayIcon from '@/shared/assets/icons/play-circle.svg';
import StopIcon from '@/shared/assets/icons/stop-circle.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Text } from '@/shared/ui';

import s from './Progress.module.scss';

interface Props {
  className?: string;
  percent: number;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
}

export const Progress = memo((props: Props) => {
  const { className, percent, onPause, isPaused, onResume } = props;

  return (
    <div className={classNames(s.progress, [className], { [s.paused]: isPaused })}>
      <div className={s.bar}>
        <div className={s.inner} style={{ width: `${percent}%` }} />
        <Text c="primary" s={14} w="medium" className={s.percent}>
          {Math.floor(percent)}%
        </Text>
      </div>
      {isPaused ? (
        <Button className={s.btn} icon={PlayIcon} variant="secondary" onClick={onResume} />
      ) : (
        <Button className={s.btn} variant="secondary" onClick={onPause} icon={StopIcon} />
      )}
    </div>
  );
});
