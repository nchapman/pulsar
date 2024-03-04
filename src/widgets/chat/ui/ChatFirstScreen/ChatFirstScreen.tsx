import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Logo } from '@/shared/ui';

import s from './ChatFirstScreen.module.scss';

interface Props {
  className?: string;
}

export const ChatFirstScreen = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.chatFirstScreen, [className])}>
      <div className={s.question}>
        <Logo className={s.logo} />
        <div className={s.text}>How can I help you today?</div>
      </div>
    </div>
  );
});
