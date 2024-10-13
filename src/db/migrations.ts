import { addColumns, createTable, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

import { agentsTable } from '@/db/agent/agent.schema.ts';
import { chatsTable } from '@/db/chat/chat.schema.ts';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 27,
      steps: [
        addColumns({
          table: chatsTable.name,
          columns: [{ name: chatsTable.cols.modelSettings, type: 'string', isOptional: true }],
        }),
      ],
    },
    {
      toVersion: 28,
      steps: [
        createTable({
          name: agentsTable.name,
          columns: [
            { name: agentsTable.cols.name, type: 'string' },
            { name: agentsTable.cols.data, type: 'string' },
            { name: agentsTable.cols.createdAt, type: 'number' },
            { name: agentsTable.cols.updatedAt, type: 'number' },
          ],
        }),
      ],
    },
    {
      toVersion: 29,
      steps: [
        addColumns({
          table: chatsTable.name,
          columns: [{ name: chatsTable.cols.agents, type: 'string', isOptional: true }],
        }),
      ],
    },
  ],
});
