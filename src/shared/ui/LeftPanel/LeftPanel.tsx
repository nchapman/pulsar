import { memo, ReactNode } from 'preact/compat';
import { useState } from 'preact/hooks';

import { classNames } from '@/shared/lib/func';
import { Button } from '@/shared/ui';

import s from './LeftPanel.module.scss';

interface Props {
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

export const LeftPanel = memo((props: Props) => {
  const { className, contentClassName, children } = props;
  const [isOpened, setIsOpened] = useState(true);

  const toggle = () => setIsOpened((pv) => !pv);

  return (
    <div className={classNames(s.leftPanel, [className], { [s.opened]: isOpened })}>
      <Button variant="clear" className={s.button} onClick={toggle}>
        <div className={s.buttonIcon} />
      </Button>
      <div className={s.wrapper}>
        <div className={classNames(s.content, [contentClassName])}>{children}</div>
      </div>
    </div>
  );
});
