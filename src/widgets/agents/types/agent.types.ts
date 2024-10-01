export interface Agent {
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
