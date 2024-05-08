export function getRandomElements<T>(arr: T[], count: number): T[] {
  if (arr.length <= count) {
    return arr.slice();
  }

  const selectedIndexes: number[] = [];
  const selectedElements: T[] = [];

  while (selectedIndexes.length < count) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    if (!selectedIndexes.includes(randomIndex)) {
      selectedIndexes.push(randomIndex);
      selectedElements.push(arr[randomIndex]);
    }
  }

  return selectedElements;
}
