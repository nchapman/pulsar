import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { ModelFile, ModelFileData } from '@/entities/model';
import { downloadsManager } from '@/entities/model/managers/downloads-manager.ts';
import CloseIcon from '@/shared/assets/icons/close.svg';
import DownloadIcon from '@/shared/assets/icons/download.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Icon, ProgressRounded, Text } from '@/shared/ui';
import { $modelStoreState } from '@/widgets/model-store/model/model-store.model.ts';

import { startFileDownload } from '../../lib/startFileDownload.ts';
import s from './ModelStoreFile.module.scss';

interface Props {
  className?: string;
  data: ModelFileData;
}

export const ModelStoreFile = memo((props: Props) => {
  const { className, data } = props;
  const { fitsInMemory, isGguf, isMmproj } = data;

  const fileName = data.name;

  const downloadItem = useUnit(downloadsManager.state.$downloadsNameData)[fileName];

  const { id, downloadingData } = downloadItem || {};

  const handleDownload = () => {
    if (downloadItem) return;
    startFileDownload($modelStoreState.currModel.getState()!, data.name);
  };

  function getWidget() {
    if (!downloadItem)
      return (
        <>
          {isGguf && (
            <div className={classNames(s.memoryFit, [fitsInMemory ? s.recommended : s.tooLarge])}>
              <Text s={14}>{fitsInMemory ? 'Recommended' : 'Too large for this machine'}</Text>
            </div>
          )}
          <Button variant="secondary" className={s.downloadBtn} onClick={handleDownload}>
            <Icon svg={DownloadIcon} className={s.downloadIcon} />
            Download
          </Button>
        </>
      );

    if (downloadingData.isFinished && (isMmproj || !isGguf)) return null;

    if (downloadingData.isFinished) {
      return (
        <Button className={s.startChat} variant="primary">
          Start Chat
        </Button>
      );
    }

    if (downloadingData.status === 'queued') {
      return (
        <div className={s.queued}>
          <Text className={s.queuedText} c="info" s={12}>
            Queued
          </Text>
          <Button
            variant="secondary"
            className={s.deleteBtn}
            onClick={() => downloadsManager.remove(id)}
          >
            <Icon size={12} svg={CloseIcon} className={s.closeIcon} />
          </Button>
        </div>
      );
    }

    return (
      <ProgressRounded
        className={s.progress}
        current={downloadingData.progress}
        total={downloadingData.total}
        isPaused={downloadingData.isPaused}
        onPause={() => downloadsManager.pause(id)}
        onResume={() => downloadsManager.start(id)}
      />
    );
  }

  return (
    <ModelFile data={data} className={classNames(s.modelStoreFile, [className])}>
      {getWidget()}
    </ModelFile>
  );
});
