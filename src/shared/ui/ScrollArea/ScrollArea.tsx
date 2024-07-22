import { memo, ReactNode } from 'preact/compat';
import Scrollbars from 'react-custom-scrollbars';

import { classNames } from '@/shared/lib/func';

import s from './ScrollArea.module.scss';

interface Props {
  wrapperClassName?: string;
  className?: string;
  children: ReactNode;
  height: string | number;
}

export const ScrollArea = memo((props: Props) => {
  const { className, children, height, wrapperClassName } = props;

  return (
    <div
      className={classNames(s.scrollWrapper, [wrapperClassName])}
      style={{ height: `calc(${height})` }}
    >
      <Scrollbars className={classNames(s.scrollArea, [])}>
        <div className={className}>{children}</div>
      </Scrollbars>
    </div>
  );
});
