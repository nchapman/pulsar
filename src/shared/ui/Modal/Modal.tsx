import { memo, ReactNode } from 'preact/compat';
import { useCallback, useState } from 'preact/hooks';

import CloseIcon from '@/shared/assets/icons/close.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Overlay, Portal } from '@/shared/ui';

import s from './Modal.module.scss';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;

  white?: boolean;
  noStyles?: boolean;
}

export const Modal = memo((props: ModalProps) => {
  const { className, children, open, onClose, noStyles, white } = props;
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 500);
  }, [onClose]);

  return (
    <Portal>
      <div
        className={classNames(s.modal, [className], {
          [s.open]: open && !closing,
          [s.noStyles]: noStyles,
          [s.white]: white,
        })}
      >
        <div key={String(open)} className={s.body}>
          {children}
        </div>

        <Button
          variant="clear"
          icon={CloseIcon as any}
          className={s.closeBtn}
          onClick={handleClose}
        />
        <Overlay onClick={handleClose} visible={open && !closing} modal />
      </div>
    </Portal>
  );
});
