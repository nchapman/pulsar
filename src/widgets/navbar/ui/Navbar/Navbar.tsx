import { memo } from 'preact/compat';
import { Button, Text } from '@/shared/ui';
import { classNames } from '@/shared/lib/func';
import s from './Navbar.module.scss';

interface Props {
  className?: string;
}

export const Navbar = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.navbar, [className])}>
      <Button></Button>
      <Text className={s.title} type="heading-1">
        Pulsar 1.0
      </Text>
    </div>
  );
});
