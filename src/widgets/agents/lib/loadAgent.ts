import { readLocalAgent } from '@/widgets/agents/lib/readLocalAgent.ts';
import {
  AgentCallMsg,
  AgentResponseMsg,
  CallLLMMsg,
  LLMResponseMsg,
} from '@/widgets/agents/types/agentMessage.types.ts';

export async function loadAgent(name: string) {
  const { workerScript } = await readLocalAgent(name, { script: true });

  const blob = new Blob([workerScript], { type: 'application/javascript' });

  const blobURL = URL.createObjectURL(blob);

  const worker = new Worker(blobURL);

  worker.onmessage = (e) => {
    const event: CallLLMMsg | AgentResponseMsg = e.data;

    if (event.type === 'callLLM') {
      // todo: call LLM
      worker.postMessage({ type: 'LLMResponse', text: 'LLM response: 42' } as LLMResponseMsg);
    }

    if (event.type === 'agentResponse') {
      console.log('Agent response:', event.agentResponse);
    }
  };

  worker.onerror = (error) => {
    console.error('Worker error:', error);
  };

  worker.postMessage({
    type: 'message',
    messageHistory: ['Hello Hiro!'],
    input: 'What is love?',
  } as AgentCallMsg);
}
