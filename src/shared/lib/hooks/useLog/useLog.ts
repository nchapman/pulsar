import { useEffect } from 'preact/hooks';

export function useLog(value: any, name = '') {
  useEffect(() => {
    // eslint-disable-next-line
    console.log(name, value);
  }, [name, value]);
}
