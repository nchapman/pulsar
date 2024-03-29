import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';
import { useEffect } from 'preact/hooks';

import { AIModel, downloadModel, models } from '@/entities/model';
import { classNames } from '@/shared/lib/func';
import { Avatar, Button, Card, Progress, Text } from '@/shared/ui';
import {
  $downloaded,
  $downloading,
  $percent,
  setProgress,
  setTotal,
} from '@/widgets/welcome-screen/model/welcome-screne-model.ts';

import modelImg from '../../assets/model.png';
import s from './ModelDownload.module.scss';

interface Props {
  className?: string;
  onLoaded: () => void;
  modelName: AIModel;
}

const handleDownload = (modelName: AIModel) => {
  let progress = 0;
  downloadModel(modelName, (downloaded, total) => {
    progress += downloaded;

    setTotal(total);
    setProgress(progress);
  });
};

export const ModelDownload = memo((props: Props) => {
  const { className, onLoaded, modelName } = props;
  const { name, desc, size } = models[modelName];
  const downloaded = useUnit($downloaded);
  const downloading = useUnit($downloading);
  const percent = useUnit($percent);

  useEffect(() => {
    if (downloaded) onLoaded();
  }, [downloaded, onLoaded]);

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
        <Button onClick={() => handleDownload(modelName)} variant="primary">
          Download
        </Button>
      )}
    </Card>
  );
});
