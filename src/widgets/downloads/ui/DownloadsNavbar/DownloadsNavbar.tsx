import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';

import s from './DownloadsNavbar.module.scss';

export const DownloadsNavbar = memo(() => (
  <div className={classNames(s.downloadsNavbar)}>
    <Text s={14} w="medium" className={s.store} c="primary">
      Downloads
    </Text>
  </div>
));
