import { memo } from 'preact/compat';
import { useMemo } from 'preact/hooks';

import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';
import { askQuestion } from '@/widgets/chat';
import { getRandomElements } from '@/widgets/chat/lib/utils/getRandomElements.ts';

import examplePrompts from '../../mocks/example-prompts.json';
import s from './ExamplePrompts.module.scss';

interface Props {
  className?: string;
  demo?: boolean;
}

const promptsDemo = [
  'Define interfaces for system integration.',
  'Plan a deployment for a new application.',
  'Design a network for cloud migration.',
];

export const ExamplePrompts = memo((props: Props) => {
  const { className, demo } = props;

  const prompts = useMemo(() => {
    if (demo) return null;

    return getRandomElements(examplePrompts, 4).map((prompt, idx) => (
      <div key={idx} className={s.prompt} onClick={() => askQuestion({ text: prompt.prompt })}>
        <Text s={14} c="primary">
          {prompt.title}
        </Text>
        <Text s={14} className={s.desc} c="tertiary">
          {prompt.description}
        </Text>
      </div>
    ));
  }, [demo]);

  const demoPrompts = useMemo(() => {
    if (!demo) return null;

    return promptsDemo.map((prompt, idx) => (
      <div key={idx} className={s.prompt} onClick={() => askQuestion({ text: prompt })}>
        <Text s={12} c="primary">
          {prompt}
        </Text>
      </div>
    ));
  }, [demo]);

  return (
    <div className={classNames(s.examplePrompts, [className], { [s.demo]: demo })}>
      {demo ? demoPrompts : prompts}
    </div>
  );
});
