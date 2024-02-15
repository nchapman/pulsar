import { useEffect, useRef, useState } from 'preact/hooks';
import { classNames } from '@/shared/lib/func';
import s from './ChatInput.module.scss';
import { SendIcon } from '@/widgets/chat/assets/SendIcon.tsx';

interface Props {
  className?: string;
}

export const ChatInput = (props: Props) => {
  const { className } = props;
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: Event) => {
    setInput((e.target as HTMLInputElement).value);
  };

  useEffect(() => {
    const inputEl = inputRef.current;

    function autoResize() {
      if (!inputRef.current) return;
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputEl!.scrollHeight}px`;
    }

    inputEl?.addEventListener('input', autoResize);
    return () => inputEl?.removeEventListener('input', autoResize);
  }, [input]);

  return (
    <form className={classNames(s.chatForm, [className])}>
      <textarea
        ref={inputRef}
        placeholder="Message Pulsar..."
        value={input}
        onChange={handleInputChange}
        className={s.chatInput}
        rows={1}
      />
      <button disabled={!input} type="submit" className={s.submitBtn} aria-label="submit">
        <SendIcon />
      </button>
    </form>
  );
};
