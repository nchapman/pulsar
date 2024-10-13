import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Button } from '@/shared/ui';
import { agentsManager } from '@/widgets/agents/managers/agents.manager.ts';

import s from './TestAgent.module.scss';

interface Props {
  className?: string;
}

export const TestAgent = memo((props: Props) => {
  const { className } = props;

  const handleAdd = () => {
    agentsManager.add({
      src: '/Users/demetrxx/projects/pulsar/scripts/sample-agent',
      name: 'sample-agent',
    });
  };

  const handleRemove = () => {
    agentsManager.remove('PgDCeoqO7w0TsweH');
  };

  return (
    <div className={classNames(s.testAgent, [className])}>
      <Button onClick={handleAdd} variant="primary">
        Add Agent
      </Button>
      <Button onClick={handleRemove} variant="primary">
        Remove Agent
      </Button>
    </div>
  );
});
