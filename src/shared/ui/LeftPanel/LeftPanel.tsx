import { memo, ReactNode } from 'preact/compat';
import { useState } from 'preact/hooks';
import { classNames } from '@/shared/lib/func';
import cls from './LeftPanel.module.scss';
import { Button } from '@/shared/ui';

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
    <div className={classNames(cls.leftPanel, [className], { [cls.opened]: isOpened })}>
      <Button className={cls.button} onClick={toggle}>
        <div className={cls.buttonIcon} />
      </Button>
      <div className={cls.wrapper}>
        <div className={classNames(cls.content, [contentClassName])}>{children}</div>
      </div>
    </div>
  );
});
