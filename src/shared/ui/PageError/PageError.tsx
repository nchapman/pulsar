import { classNames } from '@/shared/lib/func';
import cls from './PageError.module.scss';

interface PageErrorProps {
  className?: string;
}

export const PageError = (props: PageErrorProps) => {
  const { className } = props;

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className={classNames(cls.pageError, [className])}>
      <p>Unexpected error occurred</p>
      <button type="button" onClick={reloadPage}>
        Reload page
      </button>
    </div>
  );
};
