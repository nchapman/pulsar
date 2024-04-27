import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';
import { useCallback, useEffect } from 'preact/hooks';

import { LlmName, supportedLlms } from '@/entities/model/consts/supported-llms.const.ts';
import { classNames } from '@/shared/lib/func';
import { Avatar, Button, Card, Progress, Text } from '@/shared/ui';

import { downloadModel } from '../../api/downloadModel.ts';
import modelImg from '../../assets/model.png';
import {
  $downloaded,
  $downloading,
  $percent,
  setProgress,
  setTotal,
} from '../../model/download-models-model.ts';
import s from './ModelDownload.module.scss';

interface Props {
  className?: string;
  onLoaded: () => void;
  model: LlmName;
}

const handleDownload = ({
  model,
  onPercentChange,
}: {
  model: LlmName;
  onPercentChange: (p: number) => void;
}) => {
  let progress = 0;
  let total = 0;

  downloadModel(model, false, (downloaded, totalCur) => {
    progress += downloaded;
    total = totalCur;
    const percent = !total ? 0 : (progress / total) * 100;
    onPercentChange(percent);
  });
};

export const ModelDownload = memo((props: Props) => {
  const { className, onLoaded, model } = props;
  const { name, desc, size } = supportedLlms[model];

  const downloaded = useUnit($downloaded);
  const downloading = useUnit($downloading);
  const percent = useUnit($percent);

  useEffect(() => {
    if (downloaded) onLoaded();
  }, [downloaded, onLoaded]);

  const handleModelDownload = useCallback(() => {
    handleDownload({
      model,
      onTotalChange: setTotal,
      onProgressChange: setProgress,
    });
  }, [model]);

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

      {downloading ? (
        <Progress percent={percent} />
      ) : (
        <Button onClick={handleModelDownload} variant="primary">
          Download
        </Button>
      )}
    </Card>
  );
});
