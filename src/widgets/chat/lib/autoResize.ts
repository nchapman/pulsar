/* eslint-disable no-param-reassign */
export function autoResize(element: HTMLTextAreaElement | null) {
  if (!element) return;
  element.style.height = 'auto';
  element.style.height = `${element!.scrollHeight}px`;
}
