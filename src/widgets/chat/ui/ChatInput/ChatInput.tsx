import { useUnit } from 'effector-react';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';

import { FileData, UploadFile } from '@/features/upload-file';
import { VoiceInput } from '@/features/voice-input';
import SendIcon from '@/shared/assets/icons/send.svg';
import StopIcon from '@/shared/assets/icons/stop.svg';
import { classNames } from '@/shared/lib/func';
import { useKeyboardListener } from '@/shared/lib/hooks';
import { Button } from '@/shared/ui';
import { autoResize } from '@/widgets/chat/lib/autoResize.ts';

import { $chat, $isInputDisabled, $streamedMsgId, askQuestion } from '../../model/chat.ts';
import s from './ChatInput.module.scss';

interface Props {
  className?: string;
}

export const ChatInput = (props: Props) => {
  const { className } = props;

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState('');

  const chatId = useUnit($chat.id);

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

  const handleReceiveFile = useCallback((data?: FileData) => {
    if (!data) return;
    const { file, ext, name } = data;

    console.log('File received:', { file, ext, name });
  }, []);

  useEffect(() => {
    autoResize(inputRef.current);
  }, [input]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [chatId]);

  useKeyboardListener(() => handleSubmit(), 'Enter');

  return (
    <form onSubmit={handleSubmit} className={classNames(s.chatForm, [className])}>
      <div className={s.inputRow}>
        <textarea
          ref={inputRef}
          placeholder="Message Pulsar…"
          value={input}
          onChange={handleInputChange}
          className={s.chatInput}
          rows={1}
        />
      </div>

      <div className={s.actionsRow}>
        <UploadFile className={s.uploadFile} onFileReceive={handleReceiveFile} />

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
