import { tableSchema } from '@nozbe/watermelondb';

export const modelsTable = {
  name: 'model',
  cols: {
    name: 'name',
    data: 'data',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};

export const modelSchema = tableSchema({
  name: modelsTable.name,
  columns: [
    { name: modelsTable.cols.name, type: 'string' },
    { name: modelsTable.cols.data, type: 'string' },
    { name: modelsTable.cols.createdAt, type: 'number' },
    { name: modelsTable.cols.updatedAt, type: 'number' },
  ],
});
