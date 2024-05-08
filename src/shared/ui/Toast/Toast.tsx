import { memo, ReactNode } from 'preact/compat';
import { toast } from 'react-toastify';

import SuccessIcon from '@/shared/assets/icons/check-circle.svg';
import { classNames } from '@/shared/lib/func';
import { Icon, Text } from '@/shared/ui';

import s from './Toast.module.scss';

interface Props {
  className?: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: ReactNode;
}

const Toast = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.toast, [className])}>
      <Icon svg={SuccessIcon} className={s.icon} />

      <div className={s.content}>
        <Text s={14} w="medium" c="primary">
          {props.title}
        </Text>
        <Text className={s.description} s={12}>
          {props.message}
        </Text>
      </div>
    </div>
  );
});

export function showToast(props: Props) {
  toast(<Toast {...props} />, {
    autoClose: 2000,
    closeButton: false,
    bodyClassName: s.toastBody,
    className: s.toastContainer,
    hideProgressBar: true,
  });
}
