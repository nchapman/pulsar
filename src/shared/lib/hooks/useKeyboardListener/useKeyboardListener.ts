import { useEffect } from 'preact/hooks';

export const useKeyboardListener = (
  cb: () => void,
  code: string,
  combination: Array<keyof KeyboardEvent>
) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const validCombination = combination.every((key) => event[key]);

      if (event.code === code && validCombination) {
        event.preventDefault();

        cb();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [cb, code, combination]);
};
