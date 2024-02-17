import { memo, ReactNode } from 'preact/compat';
import { useMemo } from 'preact/hooks';
import { classNames } from '@/shared/lib/func';
import cls from './List.module.scss';

interface ListProps {
  listClassName?: string;
  itemClassName?: string;
  items: ReactNode[];
  direction?: 'vertical' | 'horizontal';
}

export const List = memo((props: ListProps) => {
  const { listClassName, itemClassName, items, direction = 'horizontal' } = props;

  const itemsList = useMemo(
    () =>
      items.map((i) => (
        <li className={itemClassName} key={window.crypto.randomUUID()}>
          {i}
        </li>
      )),
    [itemClassName, items]
  );

  return <ul className={classNames(cls.list, [listClassName, cls[direction]])}>{itemsList}</ul>;
});
