import { memo } from 'preact/compat';
import ReactSlider from 'react-slider';

import { classNames } from '@/shared/lib/func';

import s from './Slider.module.scss';

interface Props {
  className?: string;
  max: number;
  min: number;
  step: number;
  onChange: (value: number) => void;
  value: number;
}

export const Slider = memo((props: Props) => {
  const { className, min, max, step, onChange, value } = props;

  return (
    <ReactSlider
      className={classNames(s.slider, [className])}
      max={max}
      min={min}
      step={step}
      thumbClassName={s.thumb}
      renderTrack={(props) => (
        <div {...props}>
          <div className={s.thumbInner} />
        </div>
      )}
      trackClassName={s.track}
      onChange={onChange}
      value={value}
    />
  );
});
