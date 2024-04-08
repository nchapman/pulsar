import { useUnit } from 'effector-react';
import { useCallback, useEffect, useState } from 'preact/hooks';

import { AIModel } from '@/entities/model';

import { $llama } from '../consts/llama';
import { hasModel } from '../lib/hasModel';

export function useModelReady(modelName: AIModel) {
  const [ready, setReady] = useState(false);
  const llama = useUnit($llama);

  useEffect(() => {
    hasModel(modelName).then((hasModel) => {
      setReady(hasModel);
    });
  }, [modelName]);

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
