import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Logo, Text } from '@/shared/ui';

import s from './OnboardingContent.module.scss';

interface Props {
  className?: string;
}

export const OnboardingContent = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.onboardingContent, [className])}>
      <Logo size="xl" />

      <Text className={s.title} c="primary" w="medium" s={48}>
        Welcome to Pulsar
      </Text>

      <Text>
        To get started we need to setup a model! You can download other models from Manage Models,
        but to start, we recommend one of the following:
      </Text>
    </div>
  );
});
