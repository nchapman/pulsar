import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Button, Text } from '@/shared/ui';

import BackIcon from '../../assets/arrow-narrow-left.svg';
import s from './SettingsTabWrapper.module.scss';

interface Props {
  className?: string;
  title: string;
  onBack?: () => void;
  children?: any;
}

export const SettingsTabWrapper = memo((props: Props) => {
  const { className, onBack, title } = props;

  return (
    <div className={classNames(s.settingsTabWrapper, [className])}>
      {onBack && <Button variant="clear" icon={BackIcon} onClick={onBack} className={s.back} />}
      <Text s={20} w="semi" c="primary">
        {title}
      </Text>

      <div className={s.children}>{props.children}</div>
    </div>
  );
});
