import { useUnit } from 'effector-react';
import { useEffect, useRef, useState } from 'preact/hooks';

import { classNames } from '@/shared/lib/func';
import { useKeyboardListener } from '@/shared/lib/hooks';
import { SendIcon } from '@/widgets/chat/assets/SendIcon.tsx';
import { $isInputDisabled, askQuestion } from '@/widgets/chat/model/chat.ts';

import s from './ChatInput.module.scss';

interface Props {
  className?: string;
}

export const ChatInput = (props: Props) => {
  const { className } = props;

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState('');

  const disabled = useUnit($isInputDisabled) || !input;

  const handleInputChange = (e: Event) => {
    setInput((e.target as HTMLInputElement).value);
  };

  function handleSubmit(e?: Event) {
    e?.preventDefault();
    if (disabled) return;
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

  useKeyboardListener(() => handleSubmit(), 'Enter');

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
