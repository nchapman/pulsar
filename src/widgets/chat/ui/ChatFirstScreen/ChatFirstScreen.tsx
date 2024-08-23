import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Logo, Text } from '@/shared/ui';
import { $withFileUpload } from '@/widgets/chat';

import { ExamplePrompts } from '../ExamplePrompts/ExamplePrompts.tsx';
import s from './ChatFirstScreen.module.scss';

interface Props {
  className?: string;
}

export const ChatFirstScreen = memo((props: Props) => {
  const { className } = props;
  const withFileUpload = useUnit($withFileUpload);

  return (
    <div className={classNames(s.chatFirstScreen, [className], { [s.translate]: withFileUpload })}>
      <div className={s.question}>
        <Logo size="l" className={s.logo} />
        <Text w="medium" s={24} c="primary">
          How can I help you today?
        </Text>
      </div>

      <ExamplePrompts className={s.examplePrompts} />
    </div>
  );
});
