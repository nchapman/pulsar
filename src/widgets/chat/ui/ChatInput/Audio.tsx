import { useEffect, useRef } from 'preact/hooks';

import { Button } from '@/shared/ui';

// const canvasCtx = canvas.getContext("2d");

// Main block for doing the audio recording

export function Audio() {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  // eslint-disable-next-line no-undef
  const chunks = useRef<BlobPart[]>([]);

  const handleStop = () => {
    mediaRecorder.current?.stop();
  };

  const handleRecord = () => {
    mediaRecorder.current?.start();
  };

  useEffect(() => {
    const onSuccess = function (stream: MediaStream) {
      mediaRecorder.current = new MediaRecorder(stream);

      // visualize(stream);

      mediaRecorder.current.onstop = function () {
        const clipContainer = document.createElement('article');
        const clipLabel = document.createElement('p');
        const audio = document.createElement('audio');
        const deleteButton = document.createElement('button');

        clipContainer.classList.add('clip');
        audio.setAttribute('controls', '');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        clipLabel.textContent = 'New Recording';

        clipContainer.appendChild(audio);
        clipContainer.appendChild(clipLabel);
        clipContainer.appendChild(deleteButton);
        document.querySelector('body')!.appendChild(clipContainer);

        audio.controls = true;
        const blob = new Blob(chunks.current, { type: mediaRecorder.current!.mimeType });
        console.log(chunks);
        chunks.current = [];
        audio.src = window.URL.createObjectURL(blob);
      };

      mediaRecorder.current.ondataavailable = function (e) {
        chunks.current.push(e.data);
      };
    };

    if (navigator.mediaDevices.getUserMedia) {
      const constraints = { audio: true };
      chunks.current = [];

      const onError = function (err: any) {
        console.log(`The following error occured: ${err}`);
      };

      navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    }
  }, []);

  // function visualize(stream) {
  //   const source = audioCtx.createMediaStreamSource(stream);
  //
  //   const analyser = audioCtx.createAnalyser();
  //   analyser.fftSize = 2048;
  //   const bufferLength = analyser.frequencyBinCount;
  //   const dataArray = new Uint8Array(bufferLength);
  //
  //   source.connect(analyser);
  //
  //   draw();
  //
  //   function draw() {
  //     const WIDTH = canvas.width;
  //     const HEIGHT = canvas.height;
  //
  //     requestAnimationFrame(draw);
  //
  //     analyser.getByteTimeDomainData(dataArray);
  //
  //     canvasCtx.fillStyle = 'rgb(200, 200, 200)';
  //     canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  //
  //     canvasCtx.lineWidth = 2;
  //     canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
  //
  //     canvasCtx.beginPath();
  //
  //     const sliceWidth = (WIDTH * 1.0) / bufferLength;
  //     let x = 0;
  //
  //     for (let i = 0; i < bufferLength; i++) {
  //       const v = dataArray[i] / 128.0;
  //       const y = (v * HEIGHT) / 2;
  //
  //       if (i === 0) {
  //         canvasCtx.moveTo(x, y);
  //       } else {
  //         canvasCtx.lineTo(x, y);
  //       }
  //
  //       x += sliceWidth;
  //     }
  //
  //     canvasCtx.lineTo(canvas.width, canvas.height / 2);
  //     canvasCtx.stroke();
  //   }
  // }

  return (
    <div>
      <div>
        <Button variant="primary" onClick={handleRecord}>
          Record
        </Button>
        <Button variant="primary" onClick={handleStop}>
          Stop
        </Button>
      </div>
    </div>
  );
}
