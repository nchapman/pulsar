import { memo } from 'preact/compat';
import { useState } from 'preact/hooks';

import { classNames } from '@/shared/lib/func';
import { SliderWithInfo } from '@/shared/ui';

import s from './ModelSettingsMenu.module.scss';

interface Props {
  className?: string;
}

export const ModelSettingsMenu = memo((props: Props) => {
  const { className } = props;
  const [value, setValue] = useState(50);

  return (
    <div className={classNames(s.modelSettingsMenu, [className])}>
      <SliderWithInfo
        max={100}
        min={1}
        step={0.1}
        onChange={setValue}
        value={value}
        description="This sets the upper limit for the number of tokens the model can generate in response. It won't produce more than this limit. The maximum value is the context length minus the prompt length."
        name="Frequency Penalty"
      />
    </div>
  );
});
