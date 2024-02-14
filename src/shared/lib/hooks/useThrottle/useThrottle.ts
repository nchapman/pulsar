import { useCallback, useRef } from 'preact/hooks';

export const useThrottle = <T>(callback: (...args: T[]) => void, delay: number) => {
  const throttleRef = useRef(false);

  return useCallback(
    (...args: T[]) => {
      let timeout: ReturnType<typeof setTimeout>;

      if (!throttleRef.current) {
        callback(...args);
        throttleRef.current = true;

        timeout = setTimeout(() => {
          throttleRef.current = false;
        }, delay);
      }

      return () => {
        clearTimeout(timeout);
      };
    },
    [callback, delay]
  );
};
