import { addColumns, createTable, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

import { chatsTable } from '@/db/chat/chat.schema.ts';

import { documentsTable } from './document/document.schema';

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
    {
      toVersion: 7,
      steps: [
        createTable({
          name: documentsTable.name,
          columns: [
            {
              name: documentsTable.cols.filename,
              type: 'string',
            },
            {
              name: documentsTable.cols.path,
              type: 'string',
            },
            {
              name: documentsTable.cols.content,
              type: 'string',
              isOptional: true,
            },
            {
              name: documentsTable.cols.createdAt,
              type: 'number',
            },
            {
              name: documentsTable.cols.updatedAt,
              type: 'number',
            },
          ],
        }),
      ],
    },
  ],
});
