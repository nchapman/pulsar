import { memo } from 'preact/compat';

import PlayIcon from '@/shared/assets/icons/play-simple.svg';
import StopIcon from '@/shared/assets/icons/stop-simple.svg';
import { bytesToSize, classNames } from '@/shared/lib/func';
import { Icon, Text } from '@/shared/ui';

import s from './ProgressRounded.module.scss';

interface Props {
  className?: string;
  current: number;
  total: number;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
}

export const ProgressRounded = memo((props: Props) => {
  const { className, isPaused, onPause, total, onResume, current } = props;

  const percent = (current / total) * 100;

  return (
    <div
      className={classNames(s.progressRounded, [className])}
      onClick={isPaused ? onResume : onPause}
    >
      <div className={classNames(s.singleChart, [], { [s.paused]: isPaused })}>
        <svg viewBox="0 0 36 36" className={classNames(s.circularChart, [s.orange])}>
          <path
            className={s.circleBg}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={s.circle}
            strokeDasharray={`${percent}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <Icon svg={isPaused ? PlayIcon : StopIcon} className={classNames(s.icon)} />
      </div>

      <Text s={12} w="medium">
        {bytesToSize(current)} / {bytesToSize(total)}
      </Text>
    </div>
  );
});
