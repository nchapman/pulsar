import { memo, ReactNode } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';

import s from './SettingsItem.module.scss';

interface Props {
  className?: string;
  title: string;
  description?: string;
  action: ReactNode;
}

export const SettingsItem = memo((props: Props) => {
  const { className, action, description, title } = props;

  return (
    <div className={classNames(s.settingsItem, [className])}>
      <div>
        <Text s={16} w="medium" c="primary">
          {title}
        </Text>
        {description && (
          <Text c="tertiary" s={14}>
            {description}
          </Text>
        )}
      </div>
      <div className={s.actionWrapper}>{action}</div>
    </div>
  );
});
