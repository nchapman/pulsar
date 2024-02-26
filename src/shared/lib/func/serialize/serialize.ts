export function serialize<T extends object, K extends keyof T, R extends Pick<T, K>>(
  obj: T,
  fields: K[]
) {
  return fields.reduce((acc, i) => ({ ...acc, [i]: obj[i] }), {}) as R;
}
