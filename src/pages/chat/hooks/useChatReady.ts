import { useCallback, useEffect, useState } from 'preact/hooks';

import { hasModel } from '@/entities/model/lib/hasModel.ts';

export function useChatReady() {
  const [ready, setReady] = useState(true);

  useEffect(() => {
    hasModel('llava-v1.6-mistral').then(setReady);
  }, []);

  const handleLoaded = useCallback(() => {
    setReady(true);
  }, []);

  return { ready, handleLoaded };
}
