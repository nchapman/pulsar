import { createEvent, sample } from 'effector';

import { $currRoute, Route } from '@/app/routes';
import { getState } from '@/shared/lib/func';

const [$open, setOpen] = getState(false);
const close = () => setOpen(false);

const toggle = createEvent();
$open.on(toggle, (state) => !state);

const [$modalOpen, setModalOpen] = getState(false);
const openModal = () => setModalOpen(true);
const closeModal = () => setModalOpen(false);

// Close popover when opening modal
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

// Close modal when going to Agents page
sample({
  clock: $currRoute,
  target: $modalOpen,
  fn: () => false,
  filter: (v) => v === Route.Agents,
});
