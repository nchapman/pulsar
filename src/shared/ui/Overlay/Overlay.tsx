import { memo } from 'preact/compat';
import { classNames } from '@/shared/lib/func';
import { Portal } from '@/shared/ui';
import cls from './Overlay.module.scss';

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
        className={classNames(cls.overlay, [className], {
          [cls.visible]: visible,
          [cls.modal]: modal,
        })}
      ></div>
    </Portal>
  );
});
