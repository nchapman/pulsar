import { memo } from 'preact/compat';
import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';
import s from './Badge.module.scss';

interface BadgeProps {
  className?: string;
  isDark?: boolean;
  content: string | number;
  bg?: string;
}

export const Badge = memo((props: BadgeProps) => {
  const { className, content, bg, isDark = false } = props;

  return (
    <div
      className={classNames(s.badge, [className], { [s.dark]: isDark })}
      style={{ backgroundColor: bg }}
    >
      <Text type="subtitle-5" className={s.content}>
        {content}
      </Text>
    </div>
  );
});
