import { memo, ReactNode } from 'preact/compat';
import { useEffect, useRef, useState } from 'preact/hooks';

import { classNames } from '@/shared/lib/func';
import { Portal, Text } from '@/shared/ui';

import s from './Tooltip.module.scss';

interface TooltipProps {
  className?: string;
  visible?: boolean;
  text?: string;
  content?: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  success?: boolean;
  show?: boolean;
}

function getPosition(position: TooltipProps['position'], dimensions: DOMRect) {
  const { top = 0, left = 0, width = 0, height = 0 } = dimensions;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  switch (position) {
    case 'top':
      return { top: top - height, left: left + halfWidth };
    case 'bottom':
      return { top: top + height + 8, left: left + halfWidth };
    case 'left':
      return { top, left: left - width };
    case 'right':
      return { top: top + halfHeight, left: left + width, transform: 'translateY(-50%)' };
    default:
      return null;
  }
}

export const Tooltip = memo((props: TooltipProps) => {
  const { className, children, content, position = 'bottom', show, success, text } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const visible = show !== false && (props.visible ?? isHovered);

  useEffect(() => {
    if (!visible || !ref.current) return;

    const adjustPosition = () => {
      if (!visible || !ref.current) return;
      const dimensions = ref.current.getBoundingClientRect();

      setPos(getPosition(position, dimensions));
    };

    adjustPosition();
  }, [position, visible]);

  useEffect(
    () => () => {
      setIsHovered(false);
    },
    []
  );

  return (
    <div
      onFocus={() => setIsHovered(true)}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={ref}
      className={classNames(s.wrapper, [className])}
    >
      {children}
      {visible && pos && (
        <Portal>
          <div style={pos} className={classNames(s.tooltip, [s[position]])}>
            <div className={s.arrow} />
            {text ? (
              <Text
                s={12}
                c="primary"
                className={classNames(s.tooltipText, [], { [s.success]: success })}
              >
                {text}
              </Text>
            ) : (
              content
            )}
          </div>
        </Portal>
      )}
    </div>
  );
});
