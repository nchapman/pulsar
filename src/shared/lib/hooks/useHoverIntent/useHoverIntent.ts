import { useCallback, useRef, useState } from 'preact/hooks';

export const useHoverIntent = (
  delay?: number,
  onMouseEnter?: () => void,
  onMouseLeave?: () => void
) => {
  const [isShown, setIsShown] = useState(false);
  const timeout = useRef<number | null>(null);

  const handleMouseEnter = useCallback(() => {
    timeout.current = window.setTimeout(() => {
      setIsShown(true);
      onMouseEnter?.();
    }, delay);
  }, [delay, onMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    if (!timeout.current) return;

    clearTimeout(timeout.current);
    onMouseLeave?.();
  }, [onMouseLeave]);

  const hide = useCallback(() => {
    setIsShown(false);
  }, []);

  return { isShown, handleMouseEnter, handleMouseLeave, hide };
};
