// @ts-nocheck
import { Model } from '@nozbe/watermelondb';
import { date, json, readonly, text } from '@nozbe/watermelondb/decorators';

import { modelsTable } from './model.schema.ts';

export class ModelModel extends Model {
  static table = modelsTable.name;

  @text(modelsTable.cols.name) name;

  @text(modelsTable.cols.type) type;

  @json(modelsTable.cols.data, (json) => json) data;

  @readonly @date(modelsTable.cols.createdAt) createdAt;

  @readonly @date(modelsTable.cols.updatedAt) updatedAt;
}
