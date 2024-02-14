/* eslint-disable */
import { useEffect } from 'preact/hooks';

export const useDisableScroll = (disable: boolean, container = document.body) => {
  useEffect(() => {
    if (disable) {
      window.scrollTo(0, 0);
    }

    container.style.height = disable ? '100vh' : 'auto';
    container.style.overflow = disable ? 'hidden' : 'unset';

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'auto';
    };
  }, [disable]);
};
