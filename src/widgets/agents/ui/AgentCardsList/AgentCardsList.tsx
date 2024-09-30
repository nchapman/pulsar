import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';

import s from './AgentCardsList.module.scss';

interface Props {
  className?: string;
}

export const AgentCardsList = memo((props: Props) => {
  const { className } = props;

  return <div className={classNames(s.agentCardsList, [className])}></div>;
});
