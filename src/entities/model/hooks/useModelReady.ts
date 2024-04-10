import { useCallback, useEffect, useState } from 'preact/hooks';

import { AIModelName } from '@/constants';
import { loadModel } from '@/widgets/chat/api/chatApi';

import { modelExists } from '../lib/modelExists';

export function useModelReady(modelName: AIModelName) {
  const [ready, setReady] = useState<boolean | null>(null);

  const checkModelExists = useCallback(async () => {
    const exists = await modelExists(modelName);

    console.log('model exists', exists);

    if (exists) {
      try {
        await loadModel(modelName);
        setReady(true);
      } catch (e) {
        console.error('Failed to load model', e);
        setReady(false);
      }
    }
  }, [modelName]);

  useEffect(() => {
    checkModelExists();
  }, [checkModelExists]);

  return { ready, checkModelExists };
}
