import { classNames } from '@/shared/lib/func';
import { Button, Text } from '@/shared/ui';

import s from './PageError.module.scss';

interface PageErrorProps {
  className?: string;
  errorText?: string;
}

export const PageError = (props: PageErrorProps) => {
  const { className, errorText = 'Unexpected error occurred' } = props;

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className={classNames(s.pageError, [className])}>
      <Text s={42} c="error">
        Error occurred
      </Text>

      <Text s={20} c="primary" className={s.desc}>
        {errorText}
      </Text>

      <Button variant="primary" onClick={reloadPage}>
        Reload app
      </Button>

      <Text className={s.contact} s={14} c="secondary">
        Please contact support.
      </Text>
    </div>
  );
};
