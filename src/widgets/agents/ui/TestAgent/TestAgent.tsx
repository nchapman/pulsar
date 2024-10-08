import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Button } from '@/shared/ui';
import { loadTestAgent } from '@/widgets/agents/test/loadTestAgent.ts';

import s from './TestAgent.module.scss';

interface Props {
  className?: string;
}

export const TestAgent = memo((props: Props) => {
  const { className } = props;

  const handeLoadTestAgent = () => {
    loadTestAgent('test-agent.js');
  };

  return (
    <div className={classNames(s.testAgent, [className])}>
      <Button onClick={handeLoadTestAgent} variant="primary">
        Test Agent
      </Button>
    </div>
  );
});
