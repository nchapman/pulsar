import { tableSchema } from '@nozbe/watermelondb';

// I thought about adding binary data but WDB doesn't support it
// It's better just to save the directory path and then read the file
export const documentsTable = {
  name: 'documents',
  cols: {
    filename: 'filename',
    path: 'path',
    text: 'text',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};

export const documentSchema = tableSchema({
  name: documentsTable.name,
  columns: [
    { name: documentsTable.cols.filename, type: 'string' },
    { name: documentsTable.cols.path, type: 'string' },
    { name: documentsTable.cols.text, type: 'string' },
    { name: documentsTable.cols.createdAt, type: 'number' },
    { name: documentsTable.cols.updatedAt, type: 'number' },
  ],
});

