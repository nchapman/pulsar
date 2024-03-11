import { memo } from 'preact/compat';
import { useRef, useState } from 'preact/hooks';

import MicIcon from '@/shared/assets/icons/mic.svg';
import MicFilledIcon from '@/shared/assets/icons/mic-filled.svg';
import { classNames } from '@/shared/lib/func';
import { Button } from '@/shared/ui';

import s from './VoiceInput.module.scss';

interface Props {
  className?: string;
}

export const VoiceInput = memo((props: Props) => {
  const { className } = props;
  const [isRecording, setIsRecording] = useState(false);

  // eslint-disable-next-line no-undef
  const chunks = useRef<BlobPart[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);

  function visualize(stream: MediaStream) {
    if (!audioCtx.current) {
      audioCtx.current = new AudioContext();
    }

    const source = audioCtx.current.createMediaStreamSource(stream);

    const analyser = audioCtx.current.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    console.log(dataArray);
  }

  const handleStop = () => {
    mediaRecorder.current?.stop();
    audioCtx.current?.close();

    setTimeout(() => {
      mediaRecorder.current = null;
      audioCtx.current = null;
    }, 1000);

    setIsRecording(false);
  };

  const handleRecord = () => {
    function onSuccess(stream: MediaStream) {
      mediaRecorder.current = new MediaRecorder(stream);
      visualize(stream);

      mediaRecorder.current.onstop = () => {
        const clipContainer = document.createElement('article');
        const audio = document.createElement('audio');

        audio.setAttribute('controls', '');
        clipContainer.appendChild(audio);

        document.querySelector('body')!.appendChild(clipContainer);
        audio.controls = true;
        const blob = new Blob(chunks.current, { type: mediaRecorder.current!.mimeType });
        chunks.current = [];
        audio.src = window.URL.createObjectURL(blob);
      };

      mediaRecorder.current.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };

      mediaRecorder.current?.start();
      setIsRecording(true);
    }

    if (navigator.mediaDevices.getUserMedia) {
      const constraints = { audio: true };
      chunks.current = [];

      navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, console.error);
    }
  };

  const handleRecordClick = () => {
    if (isRecording) {
      handleStop();
    } else {
      handleRecord();
    }
  };

  return (
    <Button
      variant="primary"
      icon={isRecording ? MicFilledIcon : MicIcon}
      onClick={handleRecordClick}
      className={classNames(s.voiceInput, [className], { [s.recording]: isRecording })}
    />
  );
});
