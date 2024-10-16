import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { ModelFile, ModelFileData, modelManager } from '@/entities/model';
import {
  downloadsManager,
  DownloadsNameData,
} from '@/entities/model/managers/downloads-manager.ts';
import CheckIcon from '@/shared/assets/icons/check-circle-broken.svg';
import CloseIcon from '@/shared/assets/icons/close.svg';
import DownloadIcon from '@/shared/assets/icons/download.svg';
import { classNames } from '@/shared/lib/func';
import { useToggle } from '@/shared/lib/hooks';
import { Button, Icon, ProgressRounded, Text } from '@/shared/ui';
import { startNewChat } from '@/widgets/chat';
import { switchModelWithNewChat } from '@/widgets/chat/model/chat.ts';
import { $modelStoreState } from '@/widgets/model-store/model/model-store.model.ts';

import { startFileDownload } from '../../lib/startFileDownload.ts';
import { AdditionalFileDownloadModal } from '../AdditionalFileDownloadModal/AdditionalFileDownloadModal.tsx';
import s from './ModelStoreFile.module.scss';

interface Props {
  className?: string;
  data: ModelFileData;
  modelName: string;
}

function getDownloadItem(
  downloadsData: DownloadsNameData,
  fileData: ModelFileData,
  modelName: string
) {
  const sameNameFile = downloadsData[fileData.name];

  return sameNameFile?.remoteUrl?.includes(modelName) ? sameNameFile : null;
}

export const ModelStoreFile = memo((props: Props) => {
  const { className, data, modelName } = props;
  const { fitsInMemory, isGguf, isMmproj } = data;
  const {
    isOn: batchDownloadModalOpened,
    off: closeBatchDownloadModal,
    on: openBatchDownloadModal,
  } = useToggle();

  const downloads = useUnit(downloadsManager.state.$downloadsNameData);

  const downloadItem = getDownloadItem(downloads, data, modelName);

  const { id, downloadingData } = downloadItem || {};

  const handleDownload = () => {
    if (downloadItem) return;

    const downloadedMmp =
      Object.values(downloadsManager.downloadsNameData).findIndex(
        (i) => i.type === 'mmp' && i.modelName === modelName
      ) !== -1;

    const downloadedLlm =
      Object.values(downloadsManager.downloadsNameData).findIndex(
        (i) => i.type === 'llm' && i.modelName === modelName
      ) !== -1;

    const hasMmp = $modelStoreState.currModelFiles.getState().findIndex((i) => i.isMmproj) !== -1;

    if (isGguf) {
      if (!isMmproj && !downloadedMmp && hasMmp) {
        // no mmp
        openBatchDownloadModal();
        return;
      }

      if (isMmproj && !downloadedLlm) {
        // no llm
        openBatchDownloadModal();
        return;
      }
    }

    startFileDownload($modelStoreState.currModel.getState()!, data.name);
  };

  const handleStartChat = () => {
    if (!downloadItem?.modelFileId) return;
    if (modelManager.currentModel === downloadItem.modelFileId) {
      startNewChat();
      return;
    }
    switchModelWithNewChat(downloadItem.modelFileId);
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
          <Button
            loading={batchDownloadModalOpened}
            variant="secondary"
            className={s.downloadBtn}
            onClick={handleDownload}
          >
            <Icon svg={DownloadIcon} className={s.downloadIcon} />
            Download
          </Button>
        </>
      );

    if (downloadingData?.isFinished && (isMmproj || !isGguf)) {
      return (
        <div className={s.downloaded}>
          <Icon svg={CheckIcon} />
          <Text w="medium" s={14}>
            Downloaded
          </Text>
        </div>
      );
    }

    if (downloadingData?.isFinished) {
      return (
        <Button className={s.startChat} variant="primary" onClick={handleStartChat}>
          Start Chat
        </Button>
      );
    }

    if (downloadingData?.status === 'queued') {
      return (
        <div className={s.queued}>
          <Text className={s.queuedText} c="info" s={12}>
            Queued
          </Text>
          <Button
            variant="secondary"
            className={s.deleteBtn}
            onClick={() => downloadsManager.remove(id!)}
          >
            <Icon size={12} svg={CloseIcon} className={s.closeIcon} />
          </Button>
        </div>
      );
    }

    return (
      <ProgressRounded
        className={s.progress}
        current={downloadingData!.progress}
        total={downloadingData!.total}
        isPaused={downloadingData!.isPaused}
        onPause={() => downloadsManager.pause(id!)}
        onResume={() => downloadsManager.start(id!)}
      />
    );
  }

  return (
    <ModelFile data={data} className={classNames(s.modelStoreFile, [className])}>
      {getWidget()}
      <AdditionalFileDownloadModal
        onClose={closeBatchDownloadModal}
        open={batchDownloadModalOpened}
        type={isMmproj ? 'addLlm' : 'addMmp'}
        file={data}
      />
    </ModelFile>
  );
});
