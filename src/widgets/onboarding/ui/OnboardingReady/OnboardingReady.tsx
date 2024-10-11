import { memo } from 'preact/compat';

import { modelManager } from '@/entities/model';
import ChatIcon from '@/shared/assets/icons/message-chat-circle.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Icon, Logo, Text } from '@/shared/ui';

import s from './OnboardingReady.module.scss';

interface Props {
  className?: string;
}

export const OnboardingReady = memo((props: Props) => {
  const { className } = props;

  const handleStart = () => modelManager.loadFirstAvailableModel();

  return (
    <div className={classNames(s.onboardingReady, [className])}>
      <Logo size="xl" />
      <Text className={s.title} c="primary" w="medium" s={48}>
        Hiro is ready
      </Text>

      <Button className={s.startBtn} variant="primary" onClick={handleStart}>
        <Icon svg={ChatIcon} /> Start chat
      </Button>

      <Text className={s.description} s={16}>
        We are glad to welcome you to our community.
      </Text>
    </div>
  );
});
