import { memo } from 'preact/compat';

import RefreshIcon from '@/shared/assets/icons/refresh.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Slider } from '@/shared/ui';

import { SettingTitle } from '../SettingTitle/SettingTitle.tsx';
import s from './SliderWithInfo.module.scss';

interface Props {
  className?: string;
  max: number;
  min: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  defaultVal: number;
  title: string;
  description: string;
}

function roundToOne10(value: number) {
  return Number(value.toFixed(1));
}

export const SliderWithInfo = memo((props: Props) => {
  const { className, min, max, step, onChange, defaultVal, value, title, description } = props;

  const handleChange = (e: any) => {
    const { value } = e.target;
    if (Number.isNaN(Number(value)) || value === '') {
      setTimeout(() => onChange(props.value), 100);
      return;
    }
    if ((value * 10) % 1 !== 0) {
      console.log(Number(value), roundToOne10(Number(value)));
      setTimeout(() => onChange(roundToOne10(Number(value))), 100);
      return;
    }

    onChange(Number(value));
  };

  const handleReset = () => onChange(defaultVal);

  return (
    <div className={classNames(s.sliderWithInfo, [className])}>
      <div className={s.info}>
        <SettingTitle title={title} description={description} />

        <div className={s.right}>
          <Button
            className={s.reset}
            variant="secondary"
            onClick={handleReset}
            icon={RefreshIcon}
            iconSize={16}
          />

          <input disabled value={value} className={s.value} type="number" onChange={handleChange} />
        </div>
      </div>

      <Slider max={max} min={min} step={step} value={value} onChange={onChange} />
    </div>
  );
});
