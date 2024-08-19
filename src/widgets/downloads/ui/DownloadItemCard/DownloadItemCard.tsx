import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { ModelFile, ModelFileData, modelManager } from '@/entities/model';
import { downloadsManager } from '@/entities/model/managers/downloads-manager.ts';
import CloseIcon from '@/shared/assets/icons/close.svg';
import PlayIcon from '@/shared/assets/icons/play-circle.svg';
import StopIcon from '@/shared/assets/icons/stop-circle.svg';
import RemoveIcon from '@/shared/assets/icons/trash.svg';
import { classNames } from '@/shared/lib/func';
import { Button, confirm, Icon, Progress, Text } from '@/shared/ui';
import { startNewChat } from '@/widgets/chat';

import s from './DownloadItemCard.module.scss';

interface Props {
  className?: string;
  data: ModelFileData;
}

export const DownloadItemCard = memo((props: Props) => {
  const { className, data } = props;

  const { isGguf, isMmproj } = data;

  const fileName = data.name;

  const downloadItem = useUnit(downloadsManager.state.$downloadsNameData)[fileName];

  const { id, downloadingData } = downloadItem || {};

  const handleDeleteModel = () => {
    confirm({
      type: 'danger',
      title: 'Delete this model file?',
      message:
        `This will delete the ${fileName}. ` +
        'This action will permanently remove all data. Proceed with caution.',
      onConfirm: () => downloadsManager.remove(id),
      confirmText: 'Confirm deletion',
    });
  };

  const handleStartChat = () => {
    if (!downloadItem.modelFileId) return;
    if (modelManager.currentModel === downloadItem.modelFileId) {
      startNewChat();
      return;
    }

    modelManager.switchModel(downloadItem.modelFileId);
  };

  function getWidget() {
    if (downloadingData.isFinished) {
      return (
        <div className={s.finished}>
          {!isMmproj && isGguf && (
            <Button className={s.startChat} variant="primary" onClick={handleStartChat}>
              Start Chat
            </Button>
          )}
          <Button variant="secondary" className={s.deleteBtn} onClick={handleDeleteModel}>
            <Icon size={12} svg={RemoveIcon} />
          </Button>
        </div>
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
            className={s.removeBtn}
            onClick={() => downloadsManager.remove(id)}
          >
            <Icon size={12} svg={CloseIcon} />
          </Button>
        </div>
      );
    }

    if (!downloadingData.isFinished) {
      return (
        <div className={s.progress}>
          <Progress
            className={s.progressBar}
            current={downloadingData.progress}
            total={downloadingData.total}
            isPaused={downloadingData.isPaused}
            small
          />

          <div className={s.progressActions}>
            <Button
              className={classNames(s.playBtn, [], { [s.pause]: !downloadingData.isPaused })}
              variant="secondary"
              onClick={() => downloadsManager[downloadingData.isPaused ? 'start' : 'pause'](id)}
            >
              <Icon size={12} svg={downloadingData.isPaused ? PlayIcon : StopIcon} />
            </Button>

            <Button
              variant="secondary"
              className={s.removeBtn}
              onClick={() => downloadsManager.remove(id)}
            >
              <Icon size={12} svg={CloseIcon} />
            </Button>
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <ModelFile className={classNames(s.downloadItemCard, [className])} data={data}>
      {getWidget()}
    </ModelFile>
  );
});
