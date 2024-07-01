import { memo } from 'preact/compat';

import { ModelData } from '@/db/model';
import { modelManager } from '@/entities/model';
import { getDownloadPath } from '@/entities/model/lib/getDownloadPath.ts';
import { userSettingsManager } from '@/entities/settings';
import { classNames } from '@/shared/lib/func';
import { Button, Logo, Text } from '@/shared/ui';

import s from './OnboardingContent.module.scss';

interface Props {
  className?: string;
}

function loadFirstModel() {
  const localName = 'llava-v1.6-mistral-7b.Q4_K_M.gguf';
  const mmpLocalName = 'mmproj-model-f16.gguf';

  const llm: ModelData = {
    name: 'LLava v1.6 (Mistral 7b)',
    localName,
    description: 'Some description',
    size: 12000,
    mmpName: mmpLocalName,
  };

  const mmp = {
    name: mmpLocalName,
    localName: mmpLocalName,
    description: 'Some description',
    size: 12000,
    llmName: localName,
  };

  getDownloadPath(localName)
    .then(async (path) => {
      await modelManager.addModel({ modelDto: llm, filePath: path, type: 'llm' });

      return getDownloadPath(mmpLocalName);
    })
    .then((path) => {
      modelManager.addModel({
        modelDto: mmp,
        filePath: path,
        type: 'mmp',
      });
    });

  const localName2 = 'nous-hermes-2-solar-10.7b.Q4_K_M.gguf';

  const llm2: ModelData = {
    name: 'Nous Hermes 2 (Solar 10.7b)',
    localName: localName2,
    description: 'Some description',
    size: 12000,
  };

  getDownloadPath(localName2).then(async (path) => {
    await modelManager.addModel({ modelDto: llm2, filePath: path, type: 'llm' });
  });
}

function deleteModel() {
  modelManager.deleteModel(userSettingsManager.get('defaultModel')!);
}

export const OnboardingContent = memo((props: Props) => {
  const { className } = props;

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
