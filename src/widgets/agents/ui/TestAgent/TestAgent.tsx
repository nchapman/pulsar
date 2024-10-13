import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Button } from '@/shared/ui';

import { agentsManager } from '../../managers/agents.manager.ts';
import s from './TestAgent.module.scss';

interface Props {
  className?: string;
}

agentsManager.llm = {
  call: async (prompt: string, temp: number) => {
    console.log(`Calling LLM with prompt: "${prompt}" and temperature: ${temp}...`);
    return 'LLM response: 42';
  },
  onAgentResponse: () => {
    console.log('Agent responded:');
  },
};

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

  const setActive = async () => {
    await agentsManager.setActive(['ddAWyyGJNfuGQYwd']);
    agentsManager.call('What is love?', ['Hello Hiro!']);
  };

  return (
    <div className={classNames(s.testAgent, [className])}>
      <Button onClick={handleAdd} variant="primary">
        Add Agent
      </Button>
      <Button onClick={handleRemove} variant="primary">
        Remove Agent
      </Button>
      <Button onClick={setActive} variant="primary">
        Set Active
      </Button>
    </div>
  );
});
