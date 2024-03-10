import { memo, ReactNode } from 'preact/compat';
import { useMemo } from 'preact/hooks';

import { classNames } from '@/shared/lib/func';

import s from './List.module.scss';

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

  return <ul className={classNames(s.list, [listClassName, s[direction]])}>{itemsList}</ul>;
});
