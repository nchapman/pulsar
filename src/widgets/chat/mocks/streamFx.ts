export function streamFx(config: {
  text: string;
  onStreamStart: () => void;
  onTextChunkReceived: (chunk: string) => void;
  onStreamEnd: () => void;
  delay?: number;
}) {
  const { text, onStreamStart, onTextChunkReceived, onStreamEnd, delay } = config;

  let i = 0;
  const chunkSize = 5;
  const textLength = text.length;

  onStreamStart();
  function stream() {
    setTimeout(() => {
      const curChunkSize = i + chunkSize <= textLength ? chunkSize : textLength - i;
      const nextChunk = text.slice(i, i + curChunkSize);

      onTextChunkReceived(nextChunk);
      i += curChunkSize;

      if (i < textLength) {
        stream();
      } else {
        onStreamEnd();
      }
    }, delay || 100);
  }

  stream();
}
