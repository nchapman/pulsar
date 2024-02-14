import { useEffect, useState } from 'preact/hooks';

export const useDisableAnimation = (trigger: boolean, delay: number, callback?: () => void) => {
  const [isAnimationDisabled, setIsAnimationDisabled] = useState(trigger);

  useEffect(() => {
    if (!trigger) return undefined;
    const timeout = setTimeout(() => {
      setIsAnimationDisabled(true);
      callback?.();
    }, delay);

    return () => clearTimeout(timeout);
  }, [callback, delay, trigger]);

  return isAnimationDisabled;
};
