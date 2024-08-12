import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { $modelSettings, defaultModelSettings, setModelSettings } from '@/widgets/chat';
import { modelSettingsContent } from '@/widgets/model-settings/consts/model-settings-content.ts';

import { SliderWithInfo } from '../SliderWithInfo/SliderWithInfo';
import { StopTokens } from '../StopTokens/StopTokens.tsx';
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
    label: modelSettingsContent.maxLength.label,
    description: modelSettingsContent.maxLength.description,
    defaultVal: defaultModelSettings.maxLength,
  },
  {
    name: 'temp',
    min: 0,
    max: 2,
    step: 0.1,
    label: modelSettingsContent.temp.label,
    description: modelSettingsContent.temp.description,
    defaultVal: defaultModelSettings.temp,
  },
  {
    name: 'topP',
    min: 0,
    max: 1,
    step: 0.1,
    label: modelSettingsContent.topP.label,
    description: modelSettingsContent.topP.description,
    defaultVal: defaultModelSettings.topP,
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
          title={i.label}
          defaultVal={i.defaultVal}
        />
      ))}

      <StopTokens
        onChange={(v) => setModelSettings({ stopTokens: v })}
        value={modelSettings.stopTokens}
      />
    </div>
  );
});
