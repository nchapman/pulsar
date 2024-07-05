import { memo } from 'preact/compat';

import { InitialModelDownload } from '@/entities/model';
import { LlmName } from '@/entities/model/consts/supported-llms.const.ts';
import { classNames } from '@/shared/lib/func';
import { Text, Title } from '@/shared/ui';

import s from './WelcomeScreen.module.scss';

interface Props {
  className?: string;
  model: LlmName;
}

const content = {
  title: 'Welcome to Pulsar',
  text: 'To get started you need to download a model.',
  // TODO: Add this back when we have a terms of service and privacy policy
  policy: '',
};

export const WelcomeScreen = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.welcomeScreen, [className])}>
      <div className={s.info}>
        <Title level={1} className={s.title}>
          {content.title}
        </Title>
        <Text>{content.text}</Text>
      </div>

      <InitialModelDownload className={s.modelDownload} />

      <Text s={14}>{content.policy}</Text>
    </div>
  );
});
