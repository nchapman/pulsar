import { memo, ReactNode, useLayoutEffect } from 'preact/compat';
import { useRef } from 'preact/hooks';
import Scrollbars from 'react-custom-scrollbars';

import { classNames } from '@/shared/lib/func';

import s from './ScrollArea.module.scss';

interface Props {
  wrapperClassName?: string;
  className?: string;
  children: ReactNode;
  height: string;
  width?: string;
  onScroll?: (e: any) => void;
  initialScroll?: number;
}

export const ScrollArea = memo((props: Props) => {
  const { className, children, onScroll, initialScroll, height, wrapperClassName, width } = props;
  const ref = useRef<Scrollbars>(null);

  useLayoutEffect(() => {
    if (initialScroll && ref.current) {
      ref.current.scrollTop(initialScroll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={classNames(s.scrollWrapper, [wrapperClassName])}
      style={{ height: `calc(${height})`, width }}
    >
      <Scrollbars
        ref={ref}
        onScroll={onScroll}
        renderThumbVertical={(props) => (
          <div {...props} className={classNames(s.scrollThumb, ['thumb-vertical'])} />
        )}
        className={classNames(s.scrollArea, [])}
      >
        <div className={className}>{children}</div>
      </Scrollbars>
    </div>
  );
});
