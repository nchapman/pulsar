// @ts-nocheck
import { Model } from '@nozbe/watermelondb';
import { date, text } from '@nozbe/watermelondb/decorators';

import { documentsTable } from './document.schema';

export class DocumentModel extends Model {
  static table = documentsTable.name;

  @text(documentsTable.cols.filename) filename;

  @text(documentsTable.cols.path) path;

  @text(documentsTable.cols.content) content;

  @text(documentsTable.cols.hash) hash;

  @date(documentsTable.cols.createdAt) createdAt;

  @date(documentsTable.cols.updatedAt) updatedAt;
}

