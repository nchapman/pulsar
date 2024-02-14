export const formatDateMedium = (date: Date) => {
  const today = new Date();

  if (date.getDate() === today.getDate()) {
    return 'Today';
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.getDate() === yesterday.getDate()) {
    return 'Yesterday';
  }

  return `${date.toLocaleDateString('en-US', {
    weekday: 'short',
  })}, ${date.toLocaleDateString('en-US', { dateStyle: 'medium' })}`;
};
