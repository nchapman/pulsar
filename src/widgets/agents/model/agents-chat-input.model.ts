import { getState } from '@/shared/lib/func';

const [$open, setOpen] = getState(false);
const close = () => setOpen(false);

export const agentsChatInputModel = {
  $open,
  setOpen,
  close,
};
