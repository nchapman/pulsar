import { memo } from 'preact/compat';
import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';
import cls from './Badge.module.scss';

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
      className={classNames(cls.badge, [className], { [cls.dark]: isDark })}
      style={{ backgroundColor: bg }}
    >
      <Text type="subtitle-5" className={cls.content}>
        {content}
      </Text>
    </div>
  );
});
