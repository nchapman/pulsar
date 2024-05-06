import { Collection, Database, Q } from '@nozbe/watermelondb';

import { DocumentModel } from './document.model';
import { documentsTable } from './document.schema';

export interface Document {
  id: Id;
  filename: string;
  path: string;
  content: string;
  hash: string;
  createdAt: number;
  updatedAt: number;
}

interface ListParams {
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  search?: string;
}

export class DocumentRepository {
  documentsCollection: Collection<DocumentModel>;

  constructor(private db: Database) {
    this.documentsCollection = this.db.get('documents');
  }

  async getAll(params?: ListParams) {
    const { limit = 10, offset = 0, order = 'desc', search } = params || {};

    const query: Q.Clause[] = [
      Q.sortBy(documentsTable.cols.updatedAt, Q[order]),
      Q.skip(offset),
      Q.take(limit),
    ];

    if (search) {
      query.push(Q.where(documentsTable.cols.filename, Q.like(`%${search}%`)));
    }

    return this.documentsCollection.query(...query).fetch();
  }
}

