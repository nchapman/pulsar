import { memo, ReactNode, useLayoutEffect } from 'preact/compat';
import { useEffect, useRef, useState } from 'preact/hooks';

import { classNames } from '@/shared/lib/func';

import s from './PopoverCustom.module.scss';

interface Props {
  className?: string;
  children: ReactNode;
  content: ReactNode;
  open: boolean;
  alignV: 'top' | 'bottom';
  alignH: 'left' | 'right';
  onClose: () => void;
}

export const PopoverCustom = memo((props: Props) => {
  const { className, onClose, alignV, alignH, children, open, content } = props;
  const contentRef = useRef<HTMLDivElement>(null);

  const [styles, setStyles] = useState<any>({});

  useLayoutEffect(() => {
    if (contentRef.current) {
      setStyles({
        width: contentRef.current.scrollWidth,
        height: contentRef.current.scrollHeight,
      });
    }
  }, [content]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={classNames(s.popoverCustom, [className])}>
      {children}
      {open && (
        <div
          ref={contentRef}
          style={styles}
          className={classNames(s.content, [s[alignH], s[alignV]])}
        >
          {content}
        </div>
      )}
    </div>
  );
});
