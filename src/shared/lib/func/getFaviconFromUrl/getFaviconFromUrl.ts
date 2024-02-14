export function getFaviconFromUrl(url: string): string {
  const { hostname } = new URL(url);

  return `https://s2.googleusercontent.com/s2/favicons?domain=${hostname}`;
}
