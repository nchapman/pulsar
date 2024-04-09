import { useEffect, useState } from 'preact/hooks';

import { AIModelName } from '@/constants';
import { loadModel } from '@/widgets/chat/api/chatApi';

import { modelExists } from '../lib/modelExists';

export function useModelReady(modelName: AIModelName) {
  const [ready, setReady] = useState<boolean | null>(null);

  async function checkModelExists() {
    const exists = await modelExists(modelName);

    setReady(exists);

    if (exists) {
      try {
        loadModel(modelName);
      } catch (e) {
        setReady(false);
      }
    }
  }

  useEffect(() => {
    checkModelExists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelName]);

  // useEffect(() => {
  //   if (!ready || !llama) return undefined;

  //   llama.spawn();

  //   return () => {
  //     llama.kill();
  //   };
  // }, [ready, llama]);

  return { ready, checkModelExists };
}
