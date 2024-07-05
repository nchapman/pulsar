import { memo } from 'preact/compat';

import { SwitchModelInsideChat } from '@/entities/model';
import { classNames } from '@/shared/lib/func';

import s from './ChatNavbar.module.scss';

export const ChatNavbar = memo(() => (
  <div className={classNames(s.chatNavbar)}>
    <SwitchModelInsideChat />
  </div>
));
