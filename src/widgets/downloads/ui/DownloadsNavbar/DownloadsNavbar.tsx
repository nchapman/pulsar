import { memo } from 'preact/compat';

import { goToChat } from '@/app/routes';
import BackIcon from '@/shared/assets/icons/arrow-right.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Text } from '@/shared/ui';

import s from './DownloadsNavbar.module.scss';

export const DownloadsNavbar = memo(() => (
  <div className={classNames(s.downloadsNavbar)}>
    <Button variant="clear" icon={BackIcon} className={s.backButton} onClick={goToChat} />

    <Text s={14} w="medium" className={s.store} c="primary">
      Downloads
    </Text>
  </div>
));
