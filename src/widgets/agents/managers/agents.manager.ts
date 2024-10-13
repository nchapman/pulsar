import { createEvent, createStore } from 'effector';

import { agentsRepository } from '@/db';
import { AgentsRepository } from '@/db/agent';
import { deleteAgent } from '@/widgets/agents/lib/deleteAgent.ts';
import { readLocalAgent } from '@/widgets/agents/lib/readLocalAgent.ts';
import { readLocalAgents } from '@/widgets/agents/lib/readLocalAgents.ts';

import { moveToAgents } from '../lib/moveToAgents.ts';
import { Agent } from '../types/agent.types';

type AgentsMap = Record<Id, Agent>;

class AgentsManager {
  #agents: AgentsMap = {};

  #currentAgents: Id[] = [];

  state = {
    agents: createStore<AgentsMap>({}),
  };

  #events = {
    setAgents: createEvent<AgentsMap>(),
  };

  constructor(private readonly agentsRepository: AgentsRepository) {
    this.initManager();
  }

  // public API

  async add({ src, name }: { name: string; src: string }) {
    await moveToAgents(src);

    const { manifest } = await readLocalAgent(name);

    const agent = await this.agentsRepository.create({ data: { manifest }, name });

    this.addToState(agent);
  }

  async remove(agentId: Id) {
    const agent = this.#agents[agentId];

    if (!agent) {
      throw new Error(`Agent with ${agentId} not found`);
    }

    this.removeFromState(agentId);

    await this.agentsRepository.remove(agentId);

    await deleteAgent(agent.name);
  }

  // private methods

  private logState() {
    console.log('Available agents:', this.#agents);
  }

  private addToState(agent: Agent) {
    this.#agents[agent.id] = agent;
    this.#events.setAgents(this.#agents);
    this.logState();
  }

  private removeFromState(agentId: Id) {
    delete this.#agents[agentId];
  }

  private async readLocalAgents() {
    let agents = await this.agentsRepository.getAll();
    const localAgents = await readLocalAgents();

    // remove from db if not exists in local
    for await (const agent of agents) {
      if (!localAgents.includes(agent.name)) {
        await this.agentsRepository.remove(agent.id);
      }
    }

    // remove from local if not exists in db
    for await (const agent of localAgents) {
      if (!agents.find((a) => a.name === agent)) {
        await deleteAgent(agent);
      }
    }

    agents = await this.agentsRepository.getAll();

    // add to state
    agents.forEach((agent) => this.addToState(agent));
  }

  private initState() {
    this.state.agents.on(this.#events.setAgents, (_, agents) => agents);
  }

  private async initManager() {
    this.initState();
    await this.readLocalAgents();
  }
}

export const agentsManager = new AgentsManager(agentsRepository);
