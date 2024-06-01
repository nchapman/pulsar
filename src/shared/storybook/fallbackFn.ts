export function fallbackFn<T>(fn: T, fallback: T) {
  if (import.meta.env.STORYBOOK) return fallback;

  return fn;
}
