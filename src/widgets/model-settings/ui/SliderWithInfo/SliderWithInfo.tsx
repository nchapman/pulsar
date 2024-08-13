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

export const SliderWithInfo = memo((props: Props) => {
  const { className, min, max, step, onChange, defaultVal, value, title, description } = props;

  const handleChange = (e: any) => {
    const { value } = e.target;
    if (value[value.length - 1] === '.') return;

    const numericValue = parseFloat(value);

    if (numericValue < min || numericValue > max) {
      setTimeout(() => onChange(props.value));
      return;
    }
    onChange(numericValue);
  };

  const handleReset = () => onChange(defaultVal);

  const handleKeyPress = (event: any) => {
    const { value } = event.target;

    // Allow numbers
    if (/[0-9]/.test(event.key)) {
      // Allow only one digit after the decimal point
      const parts = value.split('.');
      if (parts.length === 2 && parts[1].length >= 1) {
        event.preventDefault();
      }
    } else if (event.key === '.') {
      // Allow only one decimal point
      if (step >= 1) {
        event.preventDefault();
      }

      if (value.includes('.')) {
        event.preventDefault();
      }
    } else {
      event.preventDefault();
    }
  };

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

          <input
            onKeyPress={handleKeyPress}
            value={value}
            className={s.value}
            onChange={handleChange}
          />
        </div>
      </div>

      <Slider max={max} min={min} step={step} value={value} onChange={onChange} />
    </div>
  );
});
