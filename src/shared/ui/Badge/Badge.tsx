import { memo, ReactNode } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';

import s from './Badge.module.scss';

interface BadgeProps {
  className?: string;
  isDark?: boolean;
  content: ReactNode;
  bg?: string;
  prefix?: string;
}

export const Badge = memo((props: BadgeProps) => {
  const { className, content, bg, prefix, isDark = false } = props;

  return (
    <div
      className={classNames(s.badge, [className], { [s.dark]: isDark })}
      style={{ backgroundColor: bg }}
    >
      {prefix && (
        <Text s={12} className={s.prefix}>
          {prefix}
        </Text>
      )}
      <Text c="primary" s={12} className={s.content}>
        {content}
      </Text>
    </div>
  );
});
