import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';
import { askQuestion } from '@/widgets/chat';

import examplePrompts from '../../mocks/example-prompts.json';
import s from './ExamplePrompts.module.scss';

interface Props {
  className?: string;
}

export const ExamplePrompts = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.examplePrompts, [className])}>
      {examplePrompts.slice(0, 4).map((prompt) => (
        <div key={prompt.title} className={s.prompt} onClick={() => askQuestion(prompt.prompt)}>
          <Text s={14} c="primary">
            {prompt.title}
          </Text>
          <Text s={14} c="tertiary">
            {prompt.description}
          </Text>
        </div>
      ))}
    </div>
  );
});
