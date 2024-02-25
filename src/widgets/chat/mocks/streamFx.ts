export function streamFx(config: {
  question: string;
  text: string;
  onStreamStart: () => void;
  onTextChunkReceived: (chunk: string) => void;
  onStreamEnd: () => void;
  onTitleUpdate: (title: string) => void;
  delay?: number;
}) {
  const { text, question, onStreamStart, onTextChunkReceived, onTitleUpdate, onStreamEnd, delay } =
    config;

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

  setTimeout(() => onTitleUpdate(question), 1000);

  stream();
}
