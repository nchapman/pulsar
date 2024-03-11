import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';

import s from './Spinner.module.scss';

interface Props {
  className?: string;
  size?: number;
}

export const Spinner = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames('', [className])}>
      <div className={s.overlay}>
        <div className={classNames(s.spinner, [s.center])}>
          {[...Array(12).keys()].map((_, i) => (
            <div key={i} className={s.spinnerBlade} />
          ))}
        </div>
      </div>
    </div>
  );
});
