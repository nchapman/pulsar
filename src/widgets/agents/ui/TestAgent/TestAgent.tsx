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

  const handeLoadTestAgent = () => {
    // loadAgent('sample-agent');
    agentsManager.addAgent({ src: '/Users/demetrxx/projects/pulsar/scripts/sample-agent' });
  };

  return (
    <div className={classNames(s.testAgent, [className])}>
      <Button onClick={handeLoadTestAgent} variant="primary">
        Test Agent
      </Button>
    </div>
  );
});
