import { agentsRepository } from '@/db';
import { AgentsRepository } from '@/db/agent';

import { moveToAgents } from '../lib/moveToAgents.ts';
import { Agent } from '../types/agent.types';

class AgentsManager {
  #availableAgents: Record<Id, Agent> = {};

  #availableAgentsNameIdMap: Record<string, Id> = {};

  state = {};

  constructor(private readonly agentsRepository: AgentsRepository) {
    this.initManager();
  }

  async addAgent({ src }: { name?: string; src: string }) {
    await moveToAgents(src);

    // todo: add to db
    // todo: add to state
  }

  private async readLocalAgents() {
    // todo: read from db
    // todo: read from local
    // todo: remove from db if not exists in local
    // todo: remove from local if not exists in db
    // todo: add to state
  }

  private initState() {}

  private async initManager() {
    await this.readLocalAgents();
    this.initState();
  }
}

export const agentsManager = new AgentsManager(agentsRepository);
