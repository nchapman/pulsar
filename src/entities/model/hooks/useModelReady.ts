import { useUnit } from 'effector-react';
import { useCallback, useEffect, useState } from 'preact/hooks';

import { $llama } from '../consts/llama.ts';
import { hasModel } from '../lib/hasModel.ts';

export function useModelReady() {
  const [ready, setReady] = useState(false);
  const llama = useUnit($llama);

  useEffect(() => {
    hasModel('llava-v1.6-mistral-7b').then(setReady);
  }, []);

  useEffect(() => {
    if (!ready || !llama) return undefined;

    llama.spawn();

    return () => {
      llama.kill();
    };
  }, [ready, llama]);

  const handleLoaded = useCallback(() => {
    setReady(true);
  }, []);

  return { ready, handleLoaded };
}
