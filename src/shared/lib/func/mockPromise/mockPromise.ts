export function mockPromise<T>(time: number, value: T, resolve = true): Promise<T> {
  return new Promise((res, rej) => {
    setTimeout(resolve ? res : rej, time, value);
  });
}
