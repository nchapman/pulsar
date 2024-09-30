import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';

import s from './AgentDetailsPage.module.scss';

export const AgentDetailsPage = memo(() => <div className={classNames(s.agentDetailsPage)}></div>);
