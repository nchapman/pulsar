export function getDomainFromUrl(url: string): string {
  const { hostname } = new URL(url);

  return hostname.replace('www.', '');
}
