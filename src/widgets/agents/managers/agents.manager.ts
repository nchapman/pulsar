import { createEvent, createStore } from 'effector';

import { agentsRepository } from '@/db';
import { AgentsRepository } from '@/db/agent';

import { deleteAgent } from '../lib/deleteAgent.ts';
import { moveToAgents } from '../lib/moveToAgents.ts';
import { readLocalAgent } from '../lib/readLocalAgent.ts';
import { readLocalAgents } from '../lib/readLocalAgents.ts';
import { askAgent, registerWorker } from '../lib/worker.ts';
import { Agent, AgentLLM } from '../types/agent.types';

type AgentsMap = Record<Id, Agent>;

class AgentsManager {
  #agents: AgentsMap = {};

  #activeAgents: Id[] = [];

  #agentWorkers: Record<Id, Worker> = {};

  #llm: AgentLLM | null = null;

  ready = true;

  state = {
    agents: createStore<AgentsMap>({}),
    activeAgents: createStore<Id[]>([]),
  };

  #events = {
    setAgents: createEvent<AgentsMap>(),
    setActiveAgents: createEvent<Id[]>(),
  };

  constructor(private readonly agentsRepository: AgentsRepository) {
    this.initManager();
  }

  // public API

  async add({ src, name }: { name: string; src: string }) {
    await moveToAgents(src);

    const { manifest } = await readLocalAgent(name, { manifest: true });

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

  async call(input: string, messageHistory: string[]) {
    if (!this.ready) {
      throw new Error('Manager not ready');
    }

    if (!this.#llm) {
      throw new Error('LLM not set');
    }

    if (!this.activeAgents.length) {
      throw new Error('No agents available');
    }

    // todo: select agent to call
    const agentId = this.activeAgents[0];

    const worker = this.#agentWorkers[agentId];

    askAgent(worker, input, messageHistory);
  }

  async setActive(agents: Id[]) {
    this.ready = false;

    this.activeAgents = agents;

    // Unregister previous workers
    Object.keys(this.#agentWorkers).forEach((i) => this.unregister(i));

    // Register new workers
    await Promise.all(agents.map((i) => this.register(i)));

    this.ready = true;
    this.logState();
  }

  async addActive(id: Id) {
    this.ready = false;
    this.activeAgents = [...this.activeAgents, id];
    await this.register(id);

    this.ready = true;
    this.logState();
  }

  async removeActive(id: Id) {
    this.activeAgents = this.activeAgents.filter((i) => i !== id);
    this.unregister(id);

    this.logState();
  }

  // private methods

  private logState() {
    console.log('Available agents:', this.#agents);
    console.log('Current agents:', this.activeAgents);
    console.log('Agent workers:', this.#agentWorkers);
  }

  private async register(id: Id) {
    const agentName = this.#agents[id]?.name;
    if (!agentName) {
      throw new Error(`Agent with id ${id} not found`);
    }

    if (!this.#llm) {
      throw new Error('LLM not set');
    }

    this.#agentWorkers[id] = await registerWorker(agentName, this.#llm);
  }

  private unregister(id: Id) {
    this.#agentWorkers[id].terminate();
    delete this.#agentWorkers[id];
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
    this.state.activeAgents.on(this.#events.setActiveAgents, (_, agents) => agents);
  }

  private async initManager() {
    this.initState();
    await this.readLocalAgents();
  }

  // getters & setters

  private get activeAgents() {
    return this.#activeAgents;
  }

  private set activeAgents(agents: Id[]) {
    this.#activeAgents = agents;
    this.#events.setActiveAgents(agents);
  }

  set llm(llm: AgentLLM) {
    this.#llm = llm;
  }
}

export const agentsManager = new AgentsManager(agentsRepository);
