import { memo, ReactNode } from 'preact/compat';
import { useState } from 'preact/hooks';
import { classNames } from '@/shared/lib/func';
import cls from './Sidebar.module.scss';
import { Button } from '@/shared/ui';

interface Props {
  className?: string;
  children: ReactNode;
}

export const Sidebar = memo((props: Props) => {
  const { className, children } = props;
  const [isOpened, setIsOpened] = useState(false);

  const toggle = () => setIsOpened((pv) => !pv);

  return (
    <div className={classNames(cls.sidebar, [className], { [cls.opened]: isOpened })}>
      <Button className={cls.button} onClick={toggle}>
        <div className={cls.buttonIcon} />
      </Button>
      <div className={cls.wrapper}>
        <div className={cls.content}>{children}</div>
      </div>
    </div>
  );
});
