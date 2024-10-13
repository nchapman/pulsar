export interface StoreAgent {
  id: Id;
  name: string;
  description: string;
  icon: string;
  author: string;
  categories: Id[];
  users: number;
  likes: number;
  features: string[];
}

export enum AgentsView {
  MyAgents = 'My agents',
  AllAgents = 'All agents',
}

export interface AgentManifest {
  manifest_version: number;
  name: string;
  description: string;
  version: string;
  author: string;
  icons: {
    '128': string;
    '48': string;
    '16': string;
  };
}

export interface Agent {
  id: Id;
  name: string;
  data: {
    manifest: AgentManifest;
  };
  createdAt: number;
  updatedAt: number;
}

export interface AgentLLM {
  call: (prompt: string, temp: number) => Promise<string>;
  onAgentResponse: (res: string) => void;
}
