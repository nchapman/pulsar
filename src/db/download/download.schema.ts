import { tableSchema } from '@nozbe/watermelondb';

export const downloadsTable = {
  name: 'download',
  cols: {
    downloadingData: 'downloading_data',
    remoteUrl: 'remote_url',
    type: 'type',
    localName: 'local_name',
    dto: 'dto',
    modelId: 'model_id',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};

export const downloadSchema = tableSchema({
  name: downloadsTable.name,
  columns: [
    { name: downloadsTable.cols.downloadingData, type: 'string' },
    { name: downloadsTable.cols.remoteUrl, type: 'string' },
    { name: downloadsTable.cols.localName, type: 'string' },
    { name: downloadsTable.cols.dto, type: 'string' },
    { name: downloadsTable.cols.type, type: 'string' },
    { name: downloadsTable.cols.modelId, type: 'string', isOptional: true },
    { name: downloadsTable.cols.createdAt, type: 'number' },
    { name: downloadsTable.cols.updatedAt, type: 'number' },
  ],
});
