import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';

import s from './AgentsPage.module.scss';

export const AgentsPage = memo(() => <div className={classNames(s.agentsPage)}></div>);
