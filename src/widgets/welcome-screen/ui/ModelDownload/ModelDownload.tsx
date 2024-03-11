import { memo } from 'preact/compat';
import { useCallback, useState } from 'preact/hooks';

import { downloadModel, models } from '@/entities/model';
import { classNames } from '@/shared/lib/func';
import { Avatar, Button, Card, Progress, Text } from '@/shared/ui';

import modelImg from '../../assets/model.png';
import s from './ModelDownload.module.scss';

interface Props {
  className?: string;
  onLoaded: () => void;
}

export const ModelDownload = memo((props: Props) => {
  const { className, onLoaded } = props;
  const { name, desc, size } = models['llava-v1.6-mistral'];
  const [progress, setProgress] = useState(0);

  const handleDownload = useCallback(() => {
    downloadModel('llava-v1.6-mistral', (progress, total) => {
      console.log(progress, total);
      const percent = (progress / total) * 100;
      setProgress(percent);
      if (progress === total) onLoaded();
    });
  }, [onLoaded]);

  const isDownloading = progress > 0 && progress < 100;

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

      {isDownloading ? (
        <Progress percent={progress} />
      ) : (
        <Button onClick={handleDownload} variant="primary">
          Download
        </Button>
      )}
    </Card>
  );
});
