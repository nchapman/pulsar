import { memo } from 'preact/compat';

import { useTheme } from '@/app/providers/theme';
import { classNames } from '@/shared/lib/func';
import { Button } from '@/shared/ui';

interface ThemeSwitcherProps {
  className?: string;
}

export const ThemeSwitcher = memo((props: ThemeSwitcherProps) => {
  const { className } = props;

  const { toggleTheme } = useTheme();

  return (
    <Button
      variant="primary"
      className={classNames('', [className])}
      onClick={toggleTheme}
    ></Button>
  );
});
