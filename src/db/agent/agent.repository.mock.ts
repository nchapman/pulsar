import { Agent } from '@/widgets/agents';

import { agentsMock } from './agent.mock.ts';

export class AgentsRepositoryMock {
  agents: Agent[] = agentsMock;

  async getById(id: Id): Promise<Agent> {
    return Promise.resolve(this.agents.find((agent) => agent.id === id) as Agent);
  }

  async getAll(_?: any, __ = false): Promise<Agent[]> {
    return Promise.resolve(this.agents);
  }

  async create(data: Dto<Agent>): Promise<Agent> {
    const newAgent = {
      ...data,
      id: String(this.agents.length + 1),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.agents.push(newAgent);
    return Promise.resolve(newAgent);
  }

  async update(id: Id, data: UpdateDto<Agent>): Promise<Agent> {
    const agent = this.agents.find((agent) => agent.id === id) as Agent;
    if (!agent) return Promise.resolve(agent);

    Object.assign(agent, data);
    return Promise.resolve(agent);
  }

  async remove(id: Id): Promise<void> {
    this.agents = this.agents.filter((agent) => agent.id !== id);
    return Promise.resolve();
  }

  async archiveAll(): Promise<void> {
    this.agents = this.agents.map((agent) => ({ ...agent, isArchived: true }));
    return Promise.resolve();
  }

  async removeAll(): Promise<void> {
    this.agents = [];
    return Promise.resolve();
  }
}
