import { useCallback, useState } from 'preact/hooks';

export const useCopy = () => {
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text || '');
    setIsCopying(true);
    setCopied(true);
    setTimeout(() => setIsCopying(false), 3000);
  }, []);

  const resetCopy = useCallback(() => {
    setCopied(false);
  }, []);

  return { copy, isCopying, copied, resetCopy };
};
