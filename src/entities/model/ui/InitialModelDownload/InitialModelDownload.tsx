import { useUnit } from 'effector-react';
import { memo, useLayoutEffect } from 'preact/compat';
import { useState } from 'preact/hooks';

import { curatedModels } from '@/entities/model';
import { downloadsManager } from '@/entities/model/managers/downloads-manager.ts';
import DownloadIcon from '@/shared/assets/icons/download.svg';
import { classNames } from '@/shared/lib/func';
import { changeTheme } from '@/shared/theme';
import { Button, Icon, Progress, Text } from '@/shared/ui';
import { startFileDownload } from '@/widgets/model-store/lib/startFileDownload.ts';

import { ModelCard } from '../ModelCard/ModelCard';
import s from './InitialModelDownload.module.scss';

interface Props {
  className?: string;
}

const llava = curatedModels[0];

export const InitialModelDownload = memo((props: Props) => {
  const { className } = props;
  const [downloadId, setDownloadId] = useState<Id | null>(null);

  const data = useUnit(downloadsManager.state.$downloadsData);

  const downloadInfo = downloadId ? data[downloadId] : null;

  const { downloadingData } = downloadInfo || {};

  useLayoutEffect(() => {
    changeTheme('dark');
  }, []);

  const handleModelDownload = async () => {
    const res = await startFileDownload(llava.modelName, llava.fileName);

    setDownloadId(res!.id);
  };

  const handlePause = () => {
    downloadsManager.pause(downloadId!);
  };

  const resume = () => {
    downloadsManager.start(downloadId!);
  };

  const modelData = {
    name: llava.modelName,
    desc: llava.description,
    size: '4.37 GB',
  };

  const loadingMmp = downloadingData?.status === 'queued';

  const handleLoadTestModel = () => {
    downloadsManager.addTestModel();
  };

  return (
    <div className={classNames(s.initialModelDownload, [className])}>
      <Text className={s.requiredTitle} c="primary" w="bold" s={18}>
        Required model
      </Text>

      <ModelCard modelData={modelData} className={s.modelCard} />

      <div className={s.action}>
        {downloadingData ? (
          <Progress
            onPause={handlePause}
            isPaused={downloadingData.isPaused}
            onResume={resume}
            current={downloadingData.progress}
            total={downloadingData.total}
            loadingMmp={loadingMmp}
          />
        ) : (
          <Button onClick={handleModelDownload} variant="primary" loading={!!downloadId}>
            <Icon svg={DownloadIcon} />
            Download model
          </Button>
        )}
      </div>

        <Button variant="secondary" className={s.test} onClick={handleLoadTestModel}>
          Load test model
        </Button>
    </div>
  );
});
