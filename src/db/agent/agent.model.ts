// @ts-nocheck
import { Model } from '@nozbe/watermelondb';
import { date, json, readonly, text } from '@nozbe/watermelondb/decorators';

import { agentsTable } from './agent.schema.ts';

export class AgentModel extends Model {
  static table = agentsTable.name;

  @text(agentsTable.cols.name) name;

  @json(agentsTable.cols.data, (json) => json) data;

  @readonly @date(agentsTable.cols.createdAt) createdAt;

  @readonly @date(agentsTable.cols.updatedAt) updatedAt;
}
