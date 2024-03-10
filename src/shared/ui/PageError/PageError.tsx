import { classNames } from '@/shared/lib/func';

import s from './PageError.module.scss';

interface PageErrorProps {
  className?: string;
}

export const PageError = (props: PageErrorProps) => {
  const { className } = props;

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className={classNames(s.pageError, [className])}>
      <p>Unexpected error occurred</p>
      <button type="button" onClick={reloadPage}>
        Reload page
      </button>
    </div>
  );
};
