import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Button } from '@/shared/ui';
import { AGENT_CATEGORIES } from '@/widgets/agents/consts/categories.const.ts';

import s from './AgentCategories.module.scss';

interface Props {
  className?: string;
}

export const AgentCategories = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.agentCategories, [className])}>
      {AGENT_CATEGORIES.map((c, idx) => (
        <Button className={s.option} variant={idx % 2 === 0 ? 'secondary' : 'primary'} key={c}>
          {c.name}
        </Button>
      ))}
    </div>
  );
});
