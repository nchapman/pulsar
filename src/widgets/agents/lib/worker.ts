import { AgentLLM } from '../types/agent.types.ts';
import {
  AgentCallMsg,
  AgentMsgType,
  AgentResponseMsg,
  CallLLMMsg,
  LLMResponseMsg,
} from '../types/agentMessage.types.ts';
import { readLocalAgent } from './readLocalAgent.ts';

export async function registerWorker(name: string, llm: AgentLLM) {
  const { workerScript } = await readLocalAgent(name, { script: true });

  const blob = new Blob([workerScript], { type: 'application/javascript' });

  const blobURL = URL.createObjectURL(blob);

  const worker = new Worker(blobURL);

  worker.onmessage = (e) => {
    const event: CallLLMMsg | AgentResponseMsg = e.data;

    if (event.type === AgentMsgType.CallLLM) {
      llm
        .call(event.prompt, event.temperature)
        .then((res) =>
          worker.postMessage({ type: AgentMsgType.LLMResponse, text: res } as LLMResponseMsg)
        );
    }

    if (event.type === AgentMsgType.AgentResponse) {
      console.log('Agent response:', event.agentResponse);
      llm.onAgentResponse(event.agentResponse);
    }
  };

  worker.onerror = (error) => {
    console.error('Worker error:', error);
  };

  return worker;
}

export function askAgent(worker: Worker, input: string, messageHistory: string[]) {
  worker.postMessage({
    type: AgentMsgType.Message,
    messageHistory,
    input,
  } as AgentCallMsg);
}
