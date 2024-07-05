import { useStoreMap, useUnit } from 'effector-react';
import { memo, useLayoutEffect } from 'preact/compat';
import { useState } from 'preact/hooks';

import { curatedModels } from '@/entities/model';
import { downloadsManager } from '@/entities/model/managers/downloads-manager.ts';
import DownloadIcon from '@/shared/assets/icons/download.svg';
import { classNames } from '@/shared/lib/func';
import { changeTheme } from '@/shared/theme';
import { Button, Icon, Progress, Text } from '@/shared/ui';
import { getHuggingFaceDownloadLink } from '@/widgets/model-store/api/search-hugging-face.ts';

import { ModelCard } from '../ModelCard/ModelCard';
import s from './InitialModelDownload.module.scss';

interface Props {
  className?: string;
}

const modelData = {
  name: 'Model name',
  desc: 'Model description',
  size: '1.2 GB',
};

export const InitialModelDownload = memo((props: Props) => {
  const { className } = props;
  const [downloadId, setDownloadId] = useState<Id | null>(null);

  useStoreMap({
    store: downloadsManager.state.$downloadsData,
    keys: [downloadId],
    fn: (d, [id]) => (id ? d[id] : null),
  });

  const data = useUnit(downloadsManager.state.$downloadsData);

  const downloadInfo = downloadId ? data[downloadId] : null;

  const { downloadingData } = downloadInfo || {};

  useLayoutEffect(() => {
    changeTheme('dark');
  }, []);

  const handleModelDownload = async () => {
    const llava = curatedModels['llava-v1.6-mistral-7b'];

    const res = await downloadsManager.addDownload({
      dto: llava,
      name: llava.file.name,
      type: 'llm',
      remoteUrl: getHuggingFaceDownloadLink(llava.model.name, llava.file.name),
    });

    setDownloadId(res.id);
  };

  const handlePause = () => {
    downloadsManager.pause(downloadId!);
  };

  const resume = () => {
    downloadsManager.start(downloadId!);
  };

  return (
    <div className={classNames(s.initialModelDownload, [className])}>
      <Text className={s.requiredTitle} c="primary" w="bold" s={18}>
        Required model
      </Text>

      <ModelCard modelData={modelData} className={s.modelCard} />

      <div className={s.action}>
        {downloadingData?.percent ? (
          <Progress
            onPause={handlePause}
            isPaused={downloadingData.isPaused}
            onResume={resume}
            percent={downloadingData?.percent}
          />
        ) : (
          <Button onClick={handleModelDownload} variant="primary" loading={!!downloadId}>
            <Icon svg={DownloadIcon} />
            Download model
          </Button>
        )}
      </div>
    </div>
  );
});
