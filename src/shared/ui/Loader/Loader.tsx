import { FC } from 'preact/compat';
import { classNames } from '@/shared/lib/func';
import cls from './Loader.module.scss';

interface LoaderProps {
  className?: string;
}

export const Loader: FC<LoaderProps> = (props) => {
  // eslint-disable-next-line react/prop-types
  const { className } = props;

  return (
    <div className={classNames(cls.ldsRipple, [className])}>
      <div />
      <div />
    </div>
  );
};
