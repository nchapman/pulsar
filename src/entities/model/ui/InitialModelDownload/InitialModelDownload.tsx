import { useStoreMap, useUnit } from 'effector-react';
import { memo, useLayoutEffect } from 'preact/compat';
import { useState } from 'preact/hooks';

import { ModelData } from '@/db/model';
import { supportedLlms } from '@/entities/model/consts/supported-llms.const.ts';
import { downloadsManager } from '@/entities/model/managers/downloads-manager.ts';
import DownloadIcon from '@/shared/assets/icons/download.svg';
import { classNames } from '@/shared/lib/func';
import { changeTheme } from '@/shared/theme';
import { Button, Icon, Progress, Text } from '@/shared/ui';

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
    const llama7b = supportedLlms['nous-hermes-2-solar-10.7b.Q4_K_M.gguf'];

    const { localName, name, desc, url } = llama7b;

    const llm: ModelData = {
      name,
      localName,
      description: desc,
    };

    const res = await downloadsManager.addDownload({
      dto: llm,
      localName,
      type: 'llm',
      remoteUrl: url,
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
