import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { modelManager } from '@/entities/model';
import { getDownloadPath } from '@/entities/model/lib/getDownloadPath.ts';
import { $ready } from '@/entities/model/managers/model-manager.ts';
import { userSettingsManager } from '@/entities/model/managers/user-settings-manager.ts';
import { classNames } from '@/shared/lib/func';
import { useLog } from '@/shared/lib/hooks';
import { Button, Logo, Text } from '@/shared/ui';

import s from './OnboardingContent.module.scss';

interface Props {
  className?: string;
}

function loadFirstModel() {
  const localName = 'llava-v1.6-mistral-7b.Q4_K_M.gguf';

  getDownloadPath(localName).then((path) => {
    modelManager.addModel(
      {
        name: localName,
        localName,
        description: 'Some description',
        size: 12000,
      },
      path
    );
  });
}

function deleteModel() {
  modelManager.deleteModel(userSettingsManager.get('defaultModel')!);
}

export const OnboardingContent = memo((props: Props) => {
  const { className } = props;

  const ready = useUnit($ready);

  useLog(ready, 'ready!!!!!!!!');

  return (
    <div className={classNames(s.onboardingContent, [className])}>
      <Logo size="xl" />

      <Text className={s.title} c="primary" w="medium" s={48}>
        Welcome to Pulsar
      </Text>

      <Button variant="primary" onClick={loadFirstModel}>
        Load first model
      </Button>

      <Button variant="primary" onClick={deleteModel}>
        Delete current model
      </Button>

      <Text>
        To get started we need to setup a model! You can download other models from Manage Models,
        but to start, we recommend one of the following:
      </Text>
    </div>
  );
});
