import { createPortal, memo } from 'preact/compat';
import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';
import cls from './CopySnack.module.scss';

interface CopySnackProps {
  className?: string;
  show?: boolean;
}

export const CopySnack = memo((props: CopySnackProps) => {
  const { className, show } = props;

  if (!show) return null;

  return createPortal(
    <Text type="subtitle-3" className={classNames(cls.copySnack, [className])}>
      Copied to clipboard!
    </Text>,
    document.body
  );
});