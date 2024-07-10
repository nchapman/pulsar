export function bytesToSize(bytes: number) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const num = bytes / 1024 ** i;
  return `${num.toFixed(num > 100 ? 1 : 2)} ${sizes[i]}`;
}
