import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Portal } from '@/shared/ui';

import s from './Overlay.module.scss';

interface OverlayProps {
  className?: string;
  onClick?: () => void;
  visible?: boolean;
  modal?: boolean;
  zIndex?: number;
}

export const Overlay = memo((props: OverlayProps) => {
  const { className, onClick, zIndex, visible, modal } = props;

  return (
    <Portal>
      <div
        style={{ zIndex }}
        onClick={onClick}
        className={classNames(s.overlay, [className], {
          [s.visible]: visible,
          [s.modal]: modal,
        })}
      ></div>
    </Portal>
  );
});
