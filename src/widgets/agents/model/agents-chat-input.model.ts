import { createEvent, sample } from 'effector';

import { getState } from '@/shared/lib/func';

const [$open, setOpen] = getState(false);
const close = () => setOpen(false);

const toggle = createEvent();
$open.on(toggle, (state) => !state);

const [$modalOpen, setModalOpen] = getState(false);
const openModal = () => setModalOpen(true);
const closeModal = () => setModalOpen(false);

sample({
  clock: $modalOpen,
  target: $open,
  fn: (modalOpen) => !modalOpen,
  filter: (v) => v,
});

export const agentsChatInputModel = {
  $open,
  setOpen,
  close,
  toggle,
  $modalOpen,
  openModal,
  closeModal,
};
