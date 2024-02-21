import { memo, ReactNode } from 'preact/compat';
import { useEffect, useRef, useState } from 'preact/hooks';
import { classNames } from '@/shared/lib/func';
import { Portal, Text } from '@/shared/ui';
import cls from './Tooltip.module.scss';

interface TooltipProps {
  className?: string;
  visible?: boolean;
  text?: string;
  content?: ReactNode;
  children: ReactNode;
  position: 'top' | 'bottom' | 'left' | 'right';
  success?: boolean;
}

function getPosition(position: TooltipProps['position'], dimensions: DOMRect) {
  const { top = 0, left = 0, width = 0, height = 0 } = dimensions;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  switch (position) {
    case 'top':
      return { top: top - height, left: left + halfWidth };
    case 'bottom':
      return { top: top + height, left: left + halfWidth };
    case 'left':
      return { top, left: left - width };
    case 'right':
      return { top: top + halfHeight, left: left + width, transform: 'translateY(-50%)' };
    default:
      return null;
  }
}

export const Tooltip = memo((props: TooltipProps) => {
  const { className, children, content, position, success, text } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const visible = props.visible ?? isHovered;

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
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <div
      onFocus={() => setIsHovered(true)}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={ref}
      className={classNames(cls.wrapper, [className])}
    >
      {children}
      {visible && pos && (
        <Portal>
          <div style={pos} className={cls.tooltip}>
            {text ? (
              <Text
                className={classNames(cls.tooltipText, [], { [cls.success]: success })}
                type="subtitle-4"
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
