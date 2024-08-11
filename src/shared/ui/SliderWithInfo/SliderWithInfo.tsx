import { memo } from 'preact/compat';

import InfoIcon from '@/shared/assets/icons/info-circle.svg';
import { classNames } from '@/shared/lib/func';
import { Icon, Slider, Text, Tooltip } from '@/shared/ui';

import s from './SliderWithInfo.module.scss';

interface Props {
  className?: string;
  max: number;
  min: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  name: string;
  description: string;
}

export const SliderWithInfo = memo((props: Props) => {
  const { className, min, max, step, onChange, value, name, description } = props;

  const handleChange = (e: any) => {
    const { value } = e.target;
    if (Number.isNaN(Number(value)) || value === '') {
      console.log('here');
      setTimeout(() => onChange(props.value), 1000);
      return;
    }
    onChange(Number(value));
  };

  return (
    <div className={classNames(s.sliderWithInfo, [className])}>
      <div className={s.info}>
        <div className={s.infoLeft}>
          <Text c="primary" s={14} w="medium">
            {name}
          </Text>

          <Tooltip variant="secondary" text={description} position="topLeft">
            <Icon className={s.icon} size={16} svg={InfoIcon} />
          </Tooltip>
        </div>

        <input value={value} className={s.value} type="number" onChange={handleChange} />
      </div>

      <Slider max={max} min={min} step={step} value={value} onChange={onChange} />
    </div>
  );
});
