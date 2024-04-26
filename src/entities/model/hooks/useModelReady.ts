import { useCallback, useEffect, useState } from 'preact/hooks';

import { modelExists } from '../lib/modelExists';
import { dropModel } from '../model/model-state.ts';
import { LlmName } from '../types/model.types.ts';

export function useModelReady(llm: LlmName) {
  const [llmExists, setLlmExists] = useState<boolean | null>(null);
  const [mmmExists, setMmmExists] = useState<boolean | null>(null);

  const checkModelExists = useCallback(async () => {
    await dropModel();
    setLlmExists(await modelExists(llm));
    setMmmExists(await modelExists(llm, true));
  }, [llm]);

  useEffect(() => {
    checkModelExists();
  }, [checkModelExists]);

  useEffect(() => {
    if (llmExists && mmmExists) {
    }

    return () => dropModel();
  }, [llm, llmExists, mmmExists]);

  return { ready, checkModelExists, llmExists, mmmExists };
}
