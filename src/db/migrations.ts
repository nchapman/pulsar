import { addColumns, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

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
  ],
});
