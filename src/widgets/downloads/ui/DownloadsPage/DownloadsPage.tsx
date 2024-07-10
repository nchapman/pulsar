import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';
import { useMemo, useState } from 'preact/hooks';
import Scrollbars from 'react-custom-scrollbars';

import { DownloadsData, downloadsManager } from '@/entities/model/managers/downloads-manager.ts';
import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';
import { DownloadItemCard } from '@/widgets/downloads/ui/DownloadItemCard/DownloadItemCard.tsx';

import s from './DownloadsPage.module.scss';

enum SortBy {
  RECENT = 'recent',
}

function formatList(data: DownloadsData, sortBy = SortBy.RECENT) {
  return Object.values(data).sort((a, b) => {
    if (sortBy === SortBy.RECENT) {
      return a.createdAt - b.createdAt;
    }

    return 0;
  });
}

export const DownloadsPage = memo(() => {
  const items = useUnit(downloadsManager.state.$downloadsData);
  const [sortBy] = useState<SortBy>(SortBy.RECENT);

  const downloads = useMemo(
    () => formatList(items, sortBy).map((i) => <DownloadItemCard key={i.id} data={i} />),
    [items, sortBy]
  );

  return (
    <div className={classNames(s.downloadsPage, [])}>
      <div className={s.header}>
        <Text c="primary" w="medium" s={14}>
          {downloads.length} installed models
        </Text>
      </div>

      <Scrollbars className={s.list}></Scrollbars>
    </div>
  );
});
