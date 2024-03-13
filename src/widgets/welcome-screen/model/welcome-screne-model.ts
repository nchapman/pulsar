import { combine, createEvent, createStore, sample } from 'effector';

const $progress = createStore(0);
export const setProgress = createEvent<number>();
$progress.on(setProgress, (_, progress) => progress);

const $total = createStore(0);
export const setTotal = createEvent<number>();
sample({
  source: $total,
  clock: setTotal,
  target: $total,
  filter: (total) => total === 0,
  fn: (_, newTotal) => newTotal,
});

export const $percent = combine($progress, $total, (progress, total) =>
  !total ? 0 : (progress / total) * 100
);

export const $downloaded = combine(
  $progress,
  $total,
  (progress, total) => total > 0 && progress === total
);
export const $downloading = combine(
  $progress,
  $total,
  (progress, total) => progress > 0 && progress < total
);
