import { memo, ReactNode } from 'preact/compat';
import { useCallback, useState } from 'preact/hooks';
import { classNames } from '@/shared/lib/func';
import { Button, Overlay, Portal } from '@/shared/ui';
import CloseIcon from '@/shared/assets/icons/close.svg';
import cls from './Modal.module.scss';

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
        className={classNames(cls.modal, [className], {
          [cls.open]: open && !closing,
          [cls.noStyles]: noStyles,
          [cls.white]: white,
        })}
      >
        <div className={cls.body}>{children}</div>

        <Button icon={CloseIcon as any} className={cls.closeBtn} onClick={handleClose} />
        <Overlay onClick={handleClose} visible={open && !closing} modal />
      </div>
    </Portal>
  );
});
