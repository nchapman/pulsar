import { appWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'preact/hooks';

import { debounce } from '@/shared/lib/func';

const [handler] = debounce(async () => {
  const isFullscreen = await appWindow.isFullscreen();
  appWindow.emit('fullscreen', isFullscreen);
}, 300);

export function useFullscreen() {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const clearOnceListener = appWindow.once('fullscreen', ({ payload }) =>
      setFullscreen(payload as boolean)
    );

    const clearResizeListener = appWindow.onResized(handler);

    return async () => {
      (await clearOnceListener)();
      (await clearResizeListener)();
    };
  }, []);

  return { fullscreen };
}
