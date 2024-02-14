export function groupDataByDays<T extends object, F extends keyof T>(
  data: T[],
  field: F,
  dateFormatter: (date: Date) => string
): Map<string, T[]> {
  const groupedData: Map<string, T[]> = new Map();

  data.forEach((item) => {
    const date = new Date(item[field] as string);
    const dateString = dateFormatter(date);

    if (!groupedData.has(dateString)) {
      groupedData.set(dateString, []);
    }

    groupedData.get(dateString)?.push(item);
  });

  return groupedData;
}
