import { useStoreMap } from 'effector-react';
import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Avatar, Button, Card, Progress, Text } from '@/shared/ui';

import modelImg from '../../assets/model.png';
import { LlmName, supportedLlms } from '../../consts/supported-llms.const.ts';
import { $modelsDownload, downloadModelEff } from '../../model/manage-models-model.ts';
import s from './ModelDownload.module.scss';

interface Props {
  className?: string;
  model: LlmName;
}

export const ModelDownload = memo((props: Props) => {
  const { className, model } = props;
  const { name, desc, size } = supportedLlms[model];

  const downloadInfo = useStoreMap($modelsDownload, (s) => s[model]);

  const handleModelDownload = () => downloadModelEff(model);

  return (
    <Card className={classNames(s.modelDownload, [className])}>
      <Avatar src={modelImg} size={100} />

      <div>
        <Text className={s.size} s={12}>
          {size}
        </Text>
        <Text className={s.name} s={16} w="semi" c="primary">
          {name}
        </Text>
        <Text className={s.desc} s={12}>
          {desc}
        </Text>
      </div>

      {downloadInfo?.percent ? (
        <Progress percent={downloadInfo?.percent} />
      ) : (
        <Button onClick={handleModelDownload} variant="primary">
          Download
        </Button>
      )}
    </Card>
  );
});
