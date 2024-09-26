import { useUnit } from 'effector-react';
import { useLayoutEffect } from 'preact/compat';
import { useEffect, useRef, useState } from 'preact/hooks';

import { modelManager } from '@/entities/model';
import { UploadFile, useUploadFile } from '@/features/upload-file';
import { VoiceInput } from '@/features/voice-input';
import SendIcon from '@/shared/assets/icons/send.svg';
import StopIcon from '@/shared/assets/icons/stop.svg';
import { classNames, getState } from '@/shared/lib/func';
import { useKeyboardListener } from '@/shared/lib/hooks';
import { Button } from '@/shared/ui';
import { AgentsChatInput, AgentsChatInputBtn } from '@/widgets/agents';

import { autoResize } from '../../lib/utils/autoResize.ts';
import { $chat, $isInputDisabled, $streamedMsgId, askQuestion } from '../../model/chat.ts';
import s from './ChatInput.module.scss';

interface Props {
  className?: string;
}

export const [$withFileUpload, setWithFileUpload] = getState(false);

export const ChatInput = (props: Props) => {
  const { className } = props;

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState('');
  const { fileData, uploadFile, resetFileData } = useUploadFile();

  const chatId = useUnit($chat.id);

  const isModelReady = useUnit(modelManager.state.$ready);

  const isStreaming = useUnit($streamedMsgId);
  const disabledSend = useUnit($isInputDisabled) || !input || !isModelReady;

  const handleInputChange = (e: Event) => {
    setInput((e.target as HTMLInputElement).value);
  };

  useLayoutEffect(() => {
    setWithFileUpload(!!fileData);
  }, [fileData]);

  function handleSubmit(e?: Event) {
    e?.preventDefault();
    if (isStreaming || disabledSend) return;
    askQuestion({ text: input, file: fileData });
    setInput('');
    resetFileData();
  }
  function startNewLine() {
    setInput((prev) => `${prev}\n`);
  }

  useEffect(() => {
    autoResize(inputRef.current);
  }, [input]);

  useEffect(() => {
    setInput('');
    inputRef.current?.focus();
  }, [chatId]);

  useKeyboardListener(() => handleSubmit(), 'Enter', undefined, ['shiftKey']);
  useKeyboardListener(() => startNewLine(), 'Enter', ['shiftKey']);

  return (
    <form onSubmit={handleSubmit} className={classNames(s.chatForm, [className])}>
      <AgentsChatInput />

      <div className={s.inputRow}>
        <textarea
          ref={inputRef}
          placeholder={isModelReady ? 'Message Pulsar…' : 'Loading…'}
          value={input}
          onChange={handleInputChange}
          className={s.chatInput}
          rows={1}
        />
      </div>

      <div className={s.actionsRow}>
        <div className={s.actionsLeft}>
          <UploadFile
            className={s.uploadFile}
            onUpload={uploadFile}
            fileData={fileData}
            onRemove={resetFileData}
          />

          <div className={s.divider} />

          <AgentsChatInputBtn />
        </div>

        <div className={s.actionsRight}>
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
