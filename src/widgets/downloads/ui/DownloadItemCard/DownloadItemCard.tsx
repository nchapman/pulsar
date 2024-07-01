import { memo } from 'preact/compat';

import { DownloadItem } from '@/db/download';
import { ModelFile } from '@/entities/model';
import { downloadsManager } from '@/entities/model/managers/downloads-manager.ts';
import TrashIcon from '@/shared/assets/icons/trash.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Progress, Text } from '@/shared/ui';
import { formatDate } from '@/widgets/model-store/lib/formatDate.ts';

import s from './DownloadItemCard.module.scss';

interface Props {
  className?: string;
  data: DownloadItem;
}

export const DownloadItemCard = memo((props: Props) => {
  const { className, data } = props;

  const readyContent = (
    <div className={s.readyContent}>
      <Text className={s.date}>{formatDate(new Date(data.createdAt))}</Text>
      <Button variant="secondary">Start chat</Button>
      <Button variant="secondary" icon={TrashIcon} />
    </div>
  );

  const pendingContent = (
    <div className={s.prendingContent}>
      <Progress
        percent={data.downloadingData.percent}
        isPaused={data.downloadingData.isPaused}
        onPause={() => downloadsManager.pause(data.id)}
        onResume={() => downloadsManager.start(data.id)}
      />
      <Button variant="secondary" icon={TrashIcon} />
    </div>
  );

  return (
    <ModelFile data={data.dto.file} className={classNames(s.downloadItemCard, [className])}>
      {data.downloadingData.isFinished ? readyContent : pendingContent}
    </ModelFile>
  );
});
