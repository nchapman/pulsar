import { tableSchema } from '@nozbe/watermelondb';

export const modelFilesTable = {
  name: 'model_file',
  cols: {
    name: 'name',
    modelName: 'model_name',
    data: 'data',
    type: 'type',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};

export const modelFileSchema = tableSchema({
  name: modelFilesTable.name,
  columns: [
    { name: modelFilesTable.cols.name, type: 'string' },
    { name: modelFilesTable.cols.modelName, type: 'string' },
    { name: modelFilesTable.cols.data, type: 'string' },
    { name: modelFilesTable.cols.type, type: 'string' },
    { name: modelFilesTable.cols.createdAt, type: 'number' },
    { name: modelFilesTable.cols.updatedAt, type: 'number' },
  ],
});
