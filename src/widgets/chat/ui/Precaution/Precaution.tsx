import { memo } from 'preact/compat';
import { classNames } from '@/shared/lib/func';
import cls from './Precaution.module.scss';

interface Props {
  className?: string;
}

export const Precaution = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(cls.precaution, [className])}>
      Pulsar can make mistakes. Consider checking important information.
    </div>
  );
});
