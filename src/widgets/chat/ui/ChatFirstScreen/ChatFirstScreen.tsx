import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Logo, Text } from '@/shared/ui';
import { ExamplePrompts } from '@/widgets/chat/ui/ExamplePrompts/ExamplePrompts.tsx';

import s from './ChatFirstScreen.module.scss';

interface Props {
  className?: string;
}

export const ChatFirstScreen = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.chatFirstScreen, [className])}>
      <div className={s.question}>
        <Logo className={s.logo} />
        <Text w="medium" s={24} c="primary">
          How can I help you today?
        </Text>
      </div>

      <ExamplePrompts className={s.examplePrompts} />
    </div>
  );
});
