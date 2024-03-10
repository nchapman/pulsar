import { useUnit } from 'effector-react';
import { useEffect, useRef, useState } from 'preact/hooks';

import PlusIcon from '@/shared/assets/icons/plus.svg';
import SendIcon from '@/shared/assets/icons/send.svg';
import StopIcon from '@/shared/assets/icons/stop.svg';
import { classNames } from '@/shared/lib/func';
import { useKeyboardListener } from '@/shared/lib/hooks';
import { Button } from '@/shared/ui';

import { $isInputDisabled, $streamedMsgId, askQuestion } from '../../model/chat.ts';
import { VoiceInput } from '../VoiceInput/VoiceInput.tsx';
import s from './ChatInput.module.scss';

interface Props {
  className?: string;
}

export const ChatInput = (props: Props) => {
  const { className } = props;

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState('');

  const isStreaming = useUnit($streamedMsgId);
  const disabledSend = useUnit($isInputDisabled) || !input;

  const handleInputChange = (e: Event) => {
    setInput((e.target as HTMLInputElement).value);
  };

  function handleSubmit(e?: Event) {
    e?.preventDefault();
    if (isStreaming || disabledSend) return;
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
      <div className={s.inputRow}>
        <textarea
          ref={inputRef}
          placeholder="Type your query here..."
          value={input}
          onChange={handleInputChange}
          className={s.chatInput}
          rows={1}
        />
      </div>
      <div className={s.actionsRow}>
        <Button variant="secondary" icon={PlusIcon} />
        <div>
          <VoiceInput className={s.audioInput} />

          {!disabledSend &&
            (!isStreaming ? (
              <Button type="submit" variant="primary" icon={SendIcon} className={s.submitBtn} />
            ) : (
              <Button type="button" variant="primary" icon={StopIcon} className={s.stopBtn} />
            ))}
        </div>
      </div>
    </form>
  );
};
