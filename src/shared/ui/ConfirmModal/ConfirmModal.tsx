import { createEvent, createStore, sample } from 'effector';
import { useUnit } from 'effector-react';
import { memo, ReactNode } from 'preact/compat';
import { useCallback } from 'preact/hooks';

import { classNames } from '@/shared/lib/func';
import { Button, Modal, Text } from '@/shared/ui';

import s from './ConfirmModal.module.scss';

interface Props {
  className?: string;
  type: 'danger' | 'info';
  title: string;
  message: ReactNode;
  confirmText: string;
  onConfirm: () => void;
}

const $modalData = createStore<Props | null>(null);
const $isOpened = createStore(false);

const setOpen = createEvent<boolean>();
const setModalData = createEvent<Props | null>();

$isOpened.on(setOpen, (_, v) => v);
$modalData.on(setModalData, (_, d) => d);

function close() {
  setOpen(false);
}

export const confirm = createEvent<Props>();

$modalData.on(confirm, (_, data) => data);

sample({
  clock: $modalData,
  filter: (data) => data !== null,
  fn: () => true,
  target: $isOpened,
});

function getBtnType(type?: 'danger' | 'info') {
  return type === 'danger' ? 'danger' : 'primary';
}

export const ConfirmModal = memo(() => {
  const isOpened = useUnit($isOpened);
  const data = useUnit($modalData);
  const { className, title, type, onConfirm, confirmText, message } = data || {};

  const handleConfirm = useCallback(() => {
    onConfirm?.();
    close();
  }, [onConfirm]);

  return (
    <Modal
      zIndex={1000}
      open={isOpened}
      onClose={close}
      className={classNames(s.confirmModal, [className])}
      noClose
    >
      <Text c="primary" className={s.title} s={20} w="semi">
        {title}
      </Text>
      <div className={s.divider} />
      <Text className={s.message}>{message}</Text>

      <div className={s.actions}>
        <Button variant="secondary" onClick={close}>
          Cancel
        </Button>
        <Button variant={getBtnType(type)} onClick={handleConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
});
