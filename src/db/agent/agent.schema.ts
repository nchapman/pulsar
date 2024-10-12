import { tableSchema } from '@nozbe/watermelondb';

export const agentsTable = {
  name: 'agent',
  cols: {
    name: 'name',
    data: 'data',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};

export const agentSchema = tableSchema({
  name: agentsTable.name,
  columns: [
    { name: agentsTable.cols.name, type: 'string' },
    { name: agentsTable.cols.data, type: 'string' },
    { name: agentsTable.cols.createdAt, type: 'number' },
    { name: agentsTable.cols.updatedAt, type: 'number' },
  ],
});
