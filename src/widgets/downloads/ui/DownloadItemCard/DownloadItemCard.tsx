import { memo } from 'preact/compat';

import { DownloadItem } from '@/db/download';
import { ModelFile } from '@/entities/model';
import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';

import s from './DownloadItemCard.module.scss';

interface Props {
  className?: string;
  data: Record<string, DownloadItem[]>;
  author: string;
}

export const DownloadItemCard = memo((props: Props) => {
  const { className, data, author } = props;

  // const readyContent = (
  //   <div className={s.readyContent}>
  //     <Text className={s.date}>{formatDate(new Date(data.createdAt))}</Text>
  //     <Button variant="secondary">Start chat</Button>
  //     <Button variant="secondary" icon={TrashIcon} />
  //   </div>
  // );

  // const pendingContent = (
  //   <div className={s.pendingContent}>
  //     <Progress
  //       percent={data.downloadingData.percent}
  //       isPaused={data.downloadingData.isPaused}
  //       onPause={() => downloadsManager.pause(data.id)}
  //       onResume={() => downloadsManager.start(data.id)}
  //     />
  //     <Button variant="secondary" icon={TrashIcon} />
  //   </div>
  // );

  return (
    <div className={classNames(s.downloadItemCard, [className])}>
      <div className={s.authorHeader}>
        <Text c="primary" w="semi" s={12}>
          {author}
        </Text>
        <Text s={12}>on Hugging Face</Text>
      </div>

      {Object.entries(data).map(([modelName, items]) => (
        <div className={s.modelCard}>
          <div className={s.modelHeader}>
            <Text className="medium" s={14}>
              {modelName.split('/')[1]}
            </Text>
          </div>

          <div className={s.filesList}>
            {items.map((item) => (
              <ModelFile key={item.id} data={item.dto.file}>
                {null}
                {/* {item.downloadingData ? pendingContent : readyContent} */}
              </ModelFile>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});
