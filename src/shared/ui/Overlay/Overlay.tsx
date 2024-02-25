import { memo } from 'preact/compat';
import { classNames } from '@/shared/lib/func';
import { Portal } from '@/shared/ui';
import s from './Overlay.module.scss';

interface OverlayProps {
  className?: string;
  onClick?: () => void;
  visible?: boolean;
  modal?: boolean;
}

export const Overlay = memo((props: OverlayProps) => {
  const { className, onClick, visible, modal } = props;

  return (
    <Portal>
      <div
        onClick={onClick}
        className={classNames(s.overlay, [className], {
          [s.visible]: visible,
          [s.modal]: modal,
        })}
      ></div>
    </Portal>
  );
});
