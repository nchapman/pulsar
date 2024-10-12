import { Collection, Database } from '@nozbe/watermelondb';

import { assignValues, serialize } from '@/shared/lib/func';
import { Agent } from '@/widgets/agents';

import { AgentModel } from './agent.model.ts';
import { agentsTable } from './agent.schema.ts';

export class AgentsRepository {
  agentsCollection: Collection<AgentModel>;

  constructor(private db: Database) {
    this.agentsCollection = this.db.get(agentsTable.name);
  }

  async getById(id: Id): Promise<Agent> {
    return this.serialize(await this.agentsCollection.find(id));
  }

  async getAll(): Promise<Agent[]> {
    return this.mapSerialize(await this.agentsCollection.query().fetch());
  }

  async create(data: Dto<Agent>): Promise<Agent> {
    const newAgent = await this.db.write(() =>
      this.agentsCollection.create((d) => assignValues(d, data))
    );

    return this.serialize(newAgent);
  }

  async update(id: Id, data: UpdateDto<Agent>): Promise<Agent> {
    const agent = await this.agentsCollection.find(id);

    try {
      const updatedAgent = await this.db.write(() =>
        agent.update((agent) => {
          assignValues(agent, data);
        })
      );

      return this.serialize(updatedAgent);
    } catch (e) {
      return agent;
    }
  }

  async remove(id: Id): Promise<void> {
    const agent = await this.agentsCollection.find(id);
    await this.db.write(() => agent.destroyPermanently());
  }

  async removeAll(): Promise<void> {
    await this.db.adapter.unsafeExecute({
      sqls: [[`delete from ${agentsTable.name}`, []]],
    });
  }

  private serialize(agent: Agent): Agent {
    return serialize(agent, ['id', 'name', 'data', 'createdAt', 'updatedAt']);
  }

  private mapSerialize(agents: Agent[]): Agent[] {
    return agents.map(this.serialize);
  }
}
