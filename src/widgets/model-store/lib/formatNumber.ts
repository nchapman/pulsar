export function formatNumber(num: number) {
  if (num > 999999) {
    return `${(num / 1000000).toFixed(1)} M`;
  }

  if (num > 999) {
    return `${(num / 1000).toFixed(1)} K`;
  }

  return num;
}
