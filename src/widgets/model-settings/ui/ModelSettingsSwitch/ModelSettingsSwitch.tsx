import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Button } from '@/shared/ui';
import { $chat } from '@/widgets/chat';

import SettingsIcon from '../../assets/settings.svg';
import { openModelSettings } from '../../model/model-settings.model.ts';
import s from './ModelSettingsSwitch.module.scss';

interface Props {
  className?: string;
}

export const ModelSettingsSwitch = memo((props: Props) => {
  const { className } = props;

  const chatId = useUnit($chat.id);

  if (!chatId) return null;

  return (
    <Button
      icon={SettingsIcon}
      variant="outlined"
      className={classNames(s.modelSettingsSwitch, [className])}
      onClick={() => openModelSettings()}
    />
  );
});
