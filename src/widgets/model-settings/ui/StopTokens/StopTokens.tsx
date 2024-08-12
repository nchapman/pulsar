import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Textarea } from '@/shared/ui';
import { modelSettingsContent } from '@/widgets/model-settings/consts/model-settings-content.ts';
import { SettingTitle } from '@/widgets/model-settings/ui/SettingTitle/SettingTitle.tsx';

import s from './StopTokens.module.scss';

interface Props {
  className?: string;
  value: string[];
  onChange: (value: string[]) => void;
}

const { title, description } = modelSettingsContent.stopTokens;

export const StopTokens = memo((props: Props) => {
  const { className, value, onChange } = props;

  const handleChange = (v: string) => {
    onChange([v]);
  };

  return (
    <div className={classNames(s.stopTokens, [className])}>
      <SettingTitle title={title} description={description} />

      <Textarea value={value[0]} onChange={handleChange} className={s.textarea} rows={4} />
    </div>
  );
});
