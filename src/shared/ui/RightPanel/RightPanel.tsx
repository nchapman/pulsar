import { memo, ReactNode } from 'preact/compat';

import { classNames } from '@/shared/lib/func';

import s from './RightPanel.module.scss';

interface Props {
  className?: string;
  contentClassName?: string;
  children: ReactNode;
  open: boolean;
}

export const RightPanel = memo((props: Props) => {
  const { className, contentClassName, children, open } = props;

  return (
    <div className={classNames(s.rightPanel, [className], { [s.opened]: open })}>
      <div className={s.wrapper}>
        <div className={classNames(s.content, [contentClassName])}>{children}</div>
      </div>
    </div>
  );
});
