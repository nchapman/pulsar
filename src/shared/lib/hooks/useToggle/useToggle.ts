import { useCallback, useState } from 'preact/hooks';

export function useToggle() {
  const [isOn, setIsOn] = useState(false);

  const toggle = useCallback(() => {
    setIsOn((prev) => !prev);
  }, []);

  const off = useCallback(() => {
    setIsOn(false);
  }, []);

  const on = useCallback(() => {
    setIsOn(true);
  }, []);

  return { isOn, off, on, toggle };
}
