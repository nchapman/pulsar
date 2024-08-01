/* eslint-disable no-param-reassign */
export function autoResize(element: HTMLTextAreaElement | null) {
  if (!element) return;
  element.style.height = 'auto';
  const height = element.scrollHeight > 200 ? 200 : element.scrollHeight;
  element.style.height = `${height}px`;
}
