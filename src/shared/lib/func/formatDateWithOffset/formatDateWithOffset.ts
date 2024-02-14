export function formatDateWithOffset(dateString: string) {
  const [offset] = dateString.match(/([+-]\d)\d:\d\d/) || [];
  const date = new Date(dateString);
  const offsetInMinutes = Number.parseInt(offset || '0', 10) * 60;
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
  const targetTime = utcTime + offsetInMinutes * 60000;
  return new Date(targetTime);
}
