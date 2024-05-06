// @ts-nocheck
import { Model } from '@nozbe/watermelondb';
import { date, readonly, text } from '@nozbe/watermelondb/decorators';

import { documentsTable } from './document.schema';

export class DocumentModel extends Model {
  static table = documentsTable.name;

  @text(documentsTable.cols.filename) filename;

  @text(documentsTable.cols.path) path;

  @text(documentsTable.cols.text) text;

  @readonly @date(documentsTable.cols.createdAt) createdAt;

  @readonly @date(documentsTable.cols.updatedAt) updatedAt;
}

