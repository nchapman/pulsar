import { memo } from 'preact/compat';

import InfoIcon from '@/shared/assets/icons/info-circle.svg';
import { classNames } from '@/shared/lib/func';
import { Icon, Text, Tooltip } from '@/shared/ui';

import s from './SettingTitle.module.scss';

interface Props {
  className?: string;
  title: string;
  description: string;
}

export const SettingTitle = memo((props: Props) => {
  const { className, title, description } = props;

  return (
    <div className={classNames(s.settingTitle, [className])}>
      <Text c="primary" s={14} w="medium">
        {title}
      </Text>

      <Tooltip variant="secondary" text={description} position="topLeft">
        <Icon className={s.icon} size={16} svg={InfoIcon} />
      </Tooltip>
    </div>
  );
});
