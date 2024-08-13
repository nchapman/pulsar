import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import CloseIcon from '@/shared/assets/icons/close.svg';
import { classNames } from '@/shared/lib/func';
import { Button, RightPanel, showToast, Text } from '@/shared/ui';
import { $chat, resetModelSettings, saveModelSettingsForChat } from '@/widgets/chat';
import { ModelSettingsMenu } from '@/widgets/model-settings/ui/ModelSettingsMenu/ModelSettingsMenu.tsx';

import { $modelSettingsOpened, closeModelSettings } from '../../model/model-settings.model.ts';
import { ModelSettingsModel } from '../ModelSettingsModel/ModelSettingsModel.tsx';
import s from './ModelSettings.module.scss';

interface Props {
  className?: string;
}

export const ModelSettings = memo((props: Props) => {
  const { className } = props;

  const isOpened = useUnit($modelSettingsOpened);
  const chatId = useUnit($chat.id);

  const handleSave = async () => {
    await saveModelSettingsForChat();
    showToast({
      title: 'Settings saved',
      type: 'success',
      message: 'Model settings for the current chat have been successfully saved',
    });
  };

  return (
    <RightPanel open={isOpened} className={classNames(s.modelSettings, [className])}>
      <div className={s.header}>
        <Text c="primary" s={14} w="semi">
          Chat Settings
        </Text>

        <Text s={12} className={s.localModelLabel}>
          Local model
        </Text>

        <Button
          className={s.closeBtn}
          variant="clear"
          iconSize={16}
          icon={CloseIcon}
          onClick={() => closeModelSettings()}
        />
      </div>

      <div className={s.main}>
        <ModelSettingsModel />

        <ModelSettingsMenu className={s.modelSettingsMenu} />
      </div>

      <div className={s.footer}>
        <Button onClick={() => resetModelSettings()} className={s.reset} variant="secondary">
          Reset to default settings
        </Button>
        <Button disabled={!chatId} onClick={handleSave} className={s.saveBtn} variant="primary">
          Save for this chat
        </Button>
      </div>
    </RightPanel>
  );
});
