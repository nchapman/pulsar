import { useCallback, useEffect, useState } from 'preact/hooks';

import { AIModelName } from '@/constants';
import { dropModel, loadModel } from '@/widgets/chat/api/chatApi';

import { modelExists } from '../lib/modelExists';

export function useModelReady(modelName: AIModelName) {
  const [ready, setReady] = useState<boolean | null>(null);

  const checkModelExists = useCallback(async () => {
    await dropModel();
    const exists = await modelExists(modelName);

    if (exists) {
      try {
        await loadModel(modelName);
        setReady(true);
      } catch (e) {
        setReady(false);
      }
    }

    return async () => {
      await dropModel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelName]);

  useEffect(() => {
    checkModelExists();
  }, [checkModelExists]);

  return { ready, checkModelExists };
}
