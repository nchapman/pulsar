import { memo } from 'preact/compat';
import { useMemo } from 'preact/hooks';

import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';
import { askQuestion } from '@/widgets/chat';
import { getRandomElements } from '@/widgets/chat/lib/getRandomElements.ts';

import examplePrompts from '../../mocks/example-prompts.json';
import s from './ExamplePrompts.module.scss';

interface Props {
  className?: string;
}

export const ExamplePrompts = memo((props: Props) => {
  const { className } = props;

  const prompts = useMemo(
    () =>
      getRandomElements(examplePrompts, 4).map((prompt) => (
        <div key={prompt.title} className={s.prompt} onClick={() => askQuestion(prompt.prompt)}>
          <Text s={14} c="primary">
            {prompt.title}
          </Text>
          <Text s={14} className={s.desc} c="tertiary">
            {prompt.description}
          </Text>
        </div>
      )),
    []
  );

  return <div className={classNames(s.examplePrompts, [className])}>{prompts}</div>;
});
