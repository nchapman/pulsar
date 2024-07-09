import { memo } from 'preact/compat';

import PlayIcon from '@/shared/assets/icons/play-circle.svg';
import StopIcon from '@/shared/assets/icons/stop-circle.svg';
import { bytesToSize, classNames, getPercent } from '@/shared/lib/func';
import { Button, Text } from '@/shared/ui';

import s from './Progress.module.scss';

interface Props {
  className?: string;
  current: number;
  total: number;
  isPaused: boolean;
  onPause?: () => void;
  onResume?: () => void;
  small?: boolean;
  loadingMmp?: boolean;
}
const mmpLoadText = 'Loading vision adapter...';

export const Progress = memo((props: Props) => {
  const { className, onPause, isPaused, onResume, current, total, small, loadingMmp } = props;

  const percent = getPercent(current, total);
  const progressText = `${bytesToSize(current)} / ${bytesToSize(total)} (${percent}%)`;

  return (
    <div
      className={classNames(s.progress, [className], {
        [s.paused]: isPaused,
        [s.small]: small,
        [s.loadingMmp]: loadingMmp,
      })}
    >
      <div className={s.bar}>
        <div className={s.inner} style={{ width: `${percent}%` }} />
        <Text c="primary" s={small ? 12 : 14} w="medium" className={s.percent}>
          {loadingMmp ? mmpLoadText : progressText}
        </Text>
      </div>
      {onPause && onResume && (
        <Button
          className={s.btn}
          variant="secondary"
          onClick={isPaused ? onResume : onPause}
          icon={isPaused ? PlayIcon : StopIcon}
          disabled={loadingMmp}
        />
      )}
    </div>
  );
});
