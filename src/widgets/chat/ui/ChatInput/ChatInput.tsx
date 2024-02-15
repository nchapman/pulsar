import { classNames } from '@/shared/lib/func';
import s from './ChatInput.module.scss';

interface Props {
  className?: string;
}

export const ChatInput = (props: Props) => {
  const { className } = props;

  return (
    <form className={classNames(s.chatForm, [className])}>
      <textarea className={s.chatInput} />
      <button type="submit" className={s.submitBtn} aria-label="submit">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 11L12 6L17 11M12 18V7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
};
