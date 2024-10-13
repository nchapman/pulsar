export enum AgentMsgType {
  Message = 'message',
  CallLLM = 'callLLM',
  LLMResponse = 'LLMResponse',
  AgentResponse = 'agentResponse',
}

interface BaseAgentMsg {
  type: AgentMsgType;
}

export interface AgentCallMsg extends BaseAgentMsg {
  type: AgentMsgType.Message;
  messageHistory: string[];
  input: string;
}

export interface CallLLMMsg extends BaseAgentMsg {
  type: AgentMsgType.CallLLM;
  prompt: string;
  temperature: number;
}

export interface LLMResponseMsg extends BaseAgentMsg {
  type: AgentMsgType.LLMResponse;
  text: string;
}

export interface AgentResponseMsg extends BaseAgentMsg {
  type: AgentMsgType.AgentResponse;
  messageType: 'text' | 'error';
  agentResponse: string;
}
