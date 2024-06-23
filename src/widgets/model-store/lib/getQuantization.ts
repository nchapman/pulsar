export function getQuantization(fileName: string) {
  const [res] = fileName.match(/Q\d[-_]\w[-_]?\w?/) || [];

  return res;
}
