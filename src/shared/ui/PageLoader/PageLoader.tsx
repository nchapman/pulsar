import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Page } from '@/shared/ui';

import s from './PageLoader.module.scss';

interface Props {
  className?: string;
}

export const PageLoader = memo((props: Props) => {
  const { className } = props;

  return (
    <Page className={classNames(s.pageLoader, [className])}>
      <section>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </section>
      <div className={s.title}>Loading...</div>
    </Page>
  );
});
