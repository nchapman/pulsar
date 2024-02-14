import { useEffect, useState } from 'preact/hooks';

export const useDevice = (screen: number) => {
  const [hasMatch, setHasMatch] = useState(false);

  useEffect(() => {
    const handleResize = () => setHasMatch(window.matchMedia(`(min-width: ${screen}px)`).matches);

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize); // удаляем обработчик
  }, [screen]);

  return hasMatch;
};

export const useMobile = () => !useDevice(1080);
