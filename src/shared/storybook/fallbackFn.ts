export function fallbackFn<T, F>(fn: T, fallback: F): T {
  if (import.meta.env.STORYBOOK) {
    // @ts-ignore
    return fallback;
  }

  return fn;
}
