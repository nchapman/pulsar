// @ts-nocheck
import { Model } from '@nozbe/watermelondb';
import { date, json, readonly, text } from '@nozbe/watermelondb/decorators';

import { modelFilesTable } from './model-file.schema.ts';

export class ModelFileModel extends Model {
  static table = modelFilesTable.name;

  @text(modelFilesTable.cols.name) name;

  @text(modelFilesTable.cols.modelName) modelName;

  @text(modelFilesTable.cols.type) type;

  @json(modelFilesTable.cols.data, (json) => json) data;

  @readonly @date(modelFilesTable.cols.createdAt) createdAt;

  @readonly @date(modelFilesTable.cols.updatedAt) updatedAt;
}
