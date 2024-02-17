import { memo } from 'preact/compat';
import { Button } from '@/shared/ui';
import { classNames } from '@/shared/lib/func';
import cls from './Navbar.module.scss';
import { switchChat } from '@/widgets/chat';

interface Props {
  className?: string;
}

export const Navbar = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(cls.navbar, [className])}>
      <Button onClick={() => switchChat('1')}>Chat 1</Button>
      <Button onClick={() => switchChat('2')}>Chat 2</Button>
    </div>
  );
});
