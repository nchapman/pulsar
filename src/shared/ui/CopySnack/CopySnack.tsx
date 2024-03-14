import { createPortal, memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';

import s from './CopySnack.module.scss';

interface CopySnackProps {
  className?: string;
  show?: boolean;
}

export const CopySnack = memo((props: CopySnackProps) => {
  const { className, show } = props;

  if (!show) return null;

  return createPortal(
    <Text className={classNames(s.copySnack, [className])}>Copied to clipboard!</Text>,
    document.body
  );
});
