export interface AgentCallMsg {
  type: 'message';
  messageHistory: string[];
  input: string;
}

export interface CallLLMMsg {
  type: 'callLLM';
  prompt: string;
  temperature: string;
}

export interface LLMResponseMsg {
  type: 'LLMResponse';
  text: string;
}

export interface AgentResponseMsg {
  type: 'agentResponse';
  messageType: 'text' | 'error';
  agentResponse: string;
}
