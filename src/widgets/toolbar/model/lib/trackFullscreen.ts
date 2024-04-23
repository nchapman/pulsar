import { appWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'preact/hooks';

import { useDebounce } from '@/shared/lib/hooks';

export function useFullscreen() {
  const [fullscreen, setFullscreen] = useState(false);

  const onWindowResize = useDebounce(() => appWindow.isFullscreen().then(setFullscreen), 300);

  useEffect(() => {
    window.addEventListener('resize', onWindowResize);

    return () => window.removeEventListener('resize', onWindowResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { fullscreen };
}
