import { useCallback, useEffect, useState } from 'preact/hooks';

import { AIModel, hasModel } from '@/entities/model';
import { getModelPath } from '@/entities/model/lib/getModelPath.ts';
import Llamafile from '@/llamafile.ts';
import { isDev } from '@/shared/lib/func';

async function createLlama() {
  const model: AIModel = 'llava-v1.6-mistral-7b';
  const modelPath = isDev() ? `models/${model}` : await getModelPath(model);
  return new Llamafile(modelPath);
}

const model = await createLlama();

export function useChatReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hasModel('llava-v1.6-mistral-7b').then(setReady);
  }, []);

  useEffect(() => {
    if (!ready) return undefined;

    model.spawn();

    return () => {
      model.kill();
    };
  }, [ready]);

  const handleLoaded = useCallback(() => {
    setReady(true);
  }, []);

  return { ready, handleLoaded };
}
