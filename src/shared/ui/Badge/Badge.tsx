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
  round?: boolean;
  c?: 'quaternary' | 'primary' | 'secondary' | 'tertiary';
}

export const Badge = memo((props: BadgeProps) => {
  const { className, content, round, bg, prefix, isDark = false, c = 'quaternary' } = props;

  return (
    <div
      className={classNames(s.badge, [className, s[c]], { [s.dark]: isDark, [s.round]: round })}
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
