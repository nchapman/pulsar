export const getPercent = (curr: number, total: number) =>
  Math.round((curr / total) * 100 * 100) / 100;
