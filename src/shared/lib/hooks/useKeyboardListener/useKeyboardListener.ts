import { useEffect } from 'preact/hooks';

export const useKeyboardListener = (
  cb: () => void,
  code: string,
  combination?: Array<keyof KeyboardEvent>,
  skip?: Array<keyof KeyboardEvent>
) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      let validCombination = combination?.every((key) => event[key]);
      let skipped = skip?.some((key) => event[key]);

      if (!combination) validCombination = true;
      if (!skip) skipped = false;

      if (event.code === code && validCombination && !skipped) {
        event.preventDefault();

        cb();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [cb, code, combination, skip]);
};
