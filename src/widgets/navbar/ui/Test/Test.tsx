import { memo } from 'preact/compat';
import { classNames } from '@/shared/lib/func';
import cls from './Test.module.scss';

interface Props {
  className?: string;
  post: any | null;
}
export const Test = memo((props: Props) => {
  const { className, post } = props;

  return <div className={classNames(cls.test, [className])}>{post?.title}</div>;
});
