import { createEvent, createStore } from 'effector';

export function getState<T>(initState: T) {
  const $state = createStore(initState);
  const setState = createEvent<T>();
  $state.on(setState, (_, v) => v);

  return [$state, setState] as const;
}
