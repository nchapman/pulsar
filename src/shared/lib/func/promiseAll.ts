export function promiseAll<T>(arr: T[], cb: (i: T, idx: number, arr: T[]) => Promise<void>) {
  return Promise.all(arr.map(cb));
}
