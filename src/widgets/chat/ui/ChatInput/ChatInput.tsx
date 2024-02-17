import { useEffect, useRef, useState } from 'preact/hooks';
import { useUnit } from 'effector-react';
import { classNames } from '@/shared/lib/func';
import s from './ChatInput.module.scss';
import { SendIcon } from '@/widgets/chat/assets/SendIcon.tsx';
import { $isInputDisabled, askQuestion } from '@/widgets/chat/model/chat.ts';

interface Props {
  className?: string;
}

export const ChatInput = (props: Props) => {
  const { className } = props;

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState('');

  const disabled = useUnit($isInputDisabled);

  const handleInputChange = (e: Event) => {
    setInput((e.target as HTMLInputElement).value);
  };

  function handleSubmit(e: Event) {
    e.preventDefault();
    askQuestion(input);
    setInput('');
  }

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
    <form onSubmit={handleSubmit} className={classNames(s.chatForm, [className])}>
      <textarea
        ref={inputRef}
        placeholder="Message Pulsar..."
        value={input}
        onChange={handleInputChange}
        className={s.chatInput}
        rows={1}
      />
      <button disabled={disabled} type="submit" className={s.submitBtn} aria-label="submit">
        <SendIcon />
      </button>
    </form>
  );
};
