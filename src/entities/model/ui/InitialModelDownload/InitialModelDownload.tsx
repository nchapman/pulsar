import { useStoreMap } from 'effector-react';
import { memo } from 'preact/compat';

import { DEFAULT_LLM, ModelCard } from '@/entities/model';
import DownloadIcon from '@/shared/assets/icons/download.svg';
import { classNames } from '@/shared/lib/func';
import { useToggle } from '@/shared/lib/hooks';
import { Button, Icon, Progress, Text } from '@/shared/ui';

import { $modelsDownload, downloadModelEff } from '../../model/manage-models-model.ts';
import s from './InitialModelDownload.module.scss';

interface Props {
  className?: string;
}

const model = DEFAULT_LLM;

export const InitialModelDownload = memo((props: Props) => {
  const { className } = props;
  const { on, off, isOn } = useToggle();

  const downloadInfo = useStoreMap($modelsDownload, (s) => s[model]);

  const handleModelDownload = () => downloadModelEff(model);

  return (
    <div className={classNames(s.initialModelDownload, [className])}>
      <Text className={s.requiredTitle} c="primary" w="bold" s={18}>
        Required model
      </Text>

      <ModelCard model={model} className={s.modelCard} />

      <div className={s.action}>
        {downloadInfo?.percent ? (
          <Progress onPause={off} isPaused={!isOn} onResume={on} percent={downloadInfo?.percent} />
        ) : (
          <Button onClick={handleModelDownload} variant="primary">
            <Icon svg={DownloadIcon} />
            Download model
          </Button>
        )}
      </div>
    </div>
  );
});
