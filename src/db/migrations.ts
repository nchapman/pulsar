import { addColumns, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

import { chatsTable } from '@/db/chat/chat.schema.ts';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 6,
      steps: [
        addColumns({
          table: chatsTable.name,
          columns: [
            { name: chatsTable.cols.isArchived, type: 'boolean', isOptional: true },
            { name: chatsTable.cols.isPinned, type: 'boolean', isOptional: true },
          ],
        }),
      ],
    },
  ],
});
