import { resourceDir } from '@tauri-apps/api/path';
import { useUnit } from 'effector-react';
import { memo, useLayoutEffect } from 'preact/compat';
import { useState } from 'preact/hooks';

import { curatedModels, modelManager } from '@/entities/model';
import { downloadsManager } from '@/entities/model/managers/downloads-manager.ts';
import DownloadIcon from '@/shared/assets/icons/download.svg';
import { classNames } from '@/shared/lib/func';
import { logi } from '@/shared/lib/Logger';
import { changeTheme } from '@/shared/theme';
import { Button, Icon, Progress, Text } from '@/shared/ui';
import { startFileDownload } from '@/widgets/model-store/lib/startFileDownload.ts';

import { ModelCard } from '../ModelCard/ModelCard';
import s from './InitialModelDownload.module.scss';

const LOG_TAG = 'InitialModelDownload';

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

  const loadEvolvedSeeker = async () => {
    try {
      logi(LOG_TAG, 'Loading EvolvedSeeker model');
      const resourceDirPath = await resourceDir();
      logi(LOG_TAG, resourceDirPath);
      await modelManager.addModel({
        dto: {
          file: {
            name: 'EvolvedSeeker',
            size: 0,
            isGguf: true,
            fitsInMemory: true,
            isMmproj: false,
          },
        },
        filePath: `sample_models/evolvedseeker_1_3.Q2_K.gguf`,
        type: 'llm',
        modelName: 'EvolvedSeeker',
      });
      logi(LOG_TAG, 'EvolvedSeeker model copied');
    } catch (e) {
      logi(LOG_TAG, `Failed to load EvolvedSeeker model ${e}`);
    }
  };

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

        {import.meta.env.DEV && (
          <Button onClick={loadEvolvedSeeker} variant="primary">
            Load EvolvedSeeker Test Model
          </Button>
        )}
      </div>

      {import.meta.env.DEV && (
        <Button variant="secondary" className={s.test} onClick={handleLoadTestModel}>
          Load test model
        </Button>
      )}
    </div>
  );
});
