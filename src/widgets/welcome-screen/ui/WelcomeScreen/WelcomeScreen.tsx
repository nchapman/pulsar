import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Text, Title } from '@/shared/ui';

import { ModelDownload } from '../ModelDownload/ModelDownload.tsx';
import s from './WelcomeScreen.module.scss';

interface Props {
  className?: string;
  onLoaded: () => void;
}

const content = {
  title: 'Welcome to Pulsar',
  text: 'To get started we need to setup a model! You can download other models from Manage Models, but to start, we recommend one of the following:',
  policy: 'You must use Pulsar in live with our Acceptable Use Policy.',
};

export const WelcomeScreen = memo((props: Props) => {
  const { className, onLoaded } = props;

  return (
    <div className={classNames(s.welcomeScreen, [className])}>
      <div className={s.info}>
        <Title level={1} className={s.title}>
          {content.title}
        </Title>
        <Text>{content.text}</Text>
      </div>

      <ModelDownload className={s.modelDownload} onLoaded={onLoaded} />

      <Text s={14}>{content.policy}</Text>
    </div>
  );
});
