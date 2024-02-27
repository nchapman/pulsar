export function assignValues<T extends object, K extends Partial<T>>(target: T, values: K) {
  Object.entries(values).forEach(([key, value]) => {
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    target[key as keyof T] = value;
  });
}
