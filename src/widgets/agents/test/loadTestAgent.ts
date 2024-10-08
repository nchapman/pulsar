import { readTextFile } from '@tauri-apps/api/fs';

import { getAgentPath } from '../lib/getAgentPath.ts';

export interface Message {
  type: 'message' | 'callLLM' | '' | 'agentResponse';
}

export async function loadTestAgent(name: string) {
  const path = await getAgentPath(name);

  const workerScript = await readTextFile(path);

  const blob = new Blob([workerScript], { type: 'application/javascript' });

  // Generate a URL for the Blob
  const blobURL = URL.createObjectURL(blob);

  // Create a Web Worker using the Blob URL
  const worker = new Worker(blobURL);

  worker.onmessage = (event) => {
    console.log('Result received from worker:', event.data);
    if (event.type === 'callLLM') {
      worker.postMessage({ type: 'callLLM' });
    }
  };

  worker.onerror = (error) => {
    console.error('Worker error:', error);
  };

  worker.postMessage({ type: 'message', messageHistory: ['Hello Hiro!'], input: 'What is love?' });
}
