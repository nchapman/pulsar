export function getQuantization(fileName: string) {
  const [res] = fileName.match(/[Qq]\d[-_]\w[-_]?\w?/) || [];

  return res?.toUpperCase();
}
