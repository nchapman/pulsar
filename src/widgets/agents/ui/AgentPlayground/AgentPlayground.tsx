import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';

import s from './AgentPlayground.module.scss';

interface Props {
  className?: string;
}

export const AgentPlayground = memo((props: Props) => {
  const { className } = props;

  return <div className={classNames(s.agentPlayground, [className])}></div>;
});
