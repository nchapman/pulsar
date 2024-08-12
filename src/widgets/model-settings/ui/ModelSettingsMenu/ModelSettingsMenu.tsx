import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { SliderWithInfo } from '@/shared/ui';
import { $modelSettings, setModelSettings } from '@/widgets/chat';

import s from './ModelSettingsMenu.module.scss';

interface Props {
  className?: string;
}

const sliders = [
  {
    name: 'maxLength',
    min: 0,
    max: 24567,
    step: 1,
    label: 'Max Tokens',
    description: '',
  },
  {
    name: 'temp',
    min: 0,
    max: 2,
    step: 0.1,
    label: 'Temperature',
    description: '',
  },
  {
    name: 'topP',
    min: 0,
    max: 1,
    step: 0.1,
    label: 'Top P',
    description: '',
  },
] as const;

export const ModelSettingsMenu = memo((props: Props) => {
  const { className } = props;
  const modelSettings = useUnit($modelSettings);

  return (
    <div className={classNames(s.modelSettingsMenu, [className])}>
      {sliders.map((i) => (
        <SliderWithInfo
          key={i.name}
          max={i.max}
          min={i.min}
          step={i.step}
          onChange={(v) => setModelSettings({ [i.name]: v })}
          value={modelSettings[i.name]}
          description={i.description}
          name={i.label}
        />
      ))}
    </div>
  );
});
