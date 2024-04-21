import { useUnit } from 'effector-react';
import { useCallback, useEffect, useState } from 'preact/hooks';

import { AIModel } from '@/entities/model';
import { useLog } from '@/shared/lib/hooks';

import { $llama } from '../consts/llama.ts';
import { hasModel } from '../lib/hasModel.ts';

export function useModelReady(modelName: AIModel) {
  const [ready, setReady] = useState(true);
  const llama = useUnit($llama);

  useLog({ modelName, ready }, 'useModelReady');

  useEffect(() => {
    hasModel(modelName).then(setReady);
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
