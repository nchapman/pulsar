import { memo } from 'preact/compat';
import { classNames } from '@/shared/lib/func';
import s from './Skeleton.module.scss';

interface SkeletonProps {
  className?: string;
  width: number | string;
  height: number | string;
}

export const Skeleton = memo((props: SkeletonProps) => {
  const { className, width, height } = props;

  return <div style={{ width, height }} className={classNames(s.skeleton, [className])} />;
});
