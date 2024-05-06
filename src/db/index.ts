import { Database as WDBDatabase, Model } from '@nozbe/watermelondb';
import { Class } from '@nozbe/watermelondb/types';
import Database from 'tauri-plugin-sql';

import { logi } from '@/shared/lib/Logger';

import { ChatModel, ChatsRepository } from './chat';
import { DocumentModel, DocumentRepository } from './document';
import { adapter } from './nativeAdapter';
import { PostModel, PostsRepository } from './post';

const watermelonDatabase = new WDBDatabase({
  adapter,
  modelClasses: [PostModel, ChatModel, DocumentModel] as Class<Model>[],
});

// eslint-disable-next-line import/no-mutable-exports
export let database: Database;

export const postsRepository = new PostsRepository(watermelonDatabase);
export const chatsRepository = new ChatsRepository(watermelonDatabase);
export const documentsRepository = new DocumentRepository(watermelonDatabase);

// FTS is not supported by watermelonDB
// So we are going to hook up to the database directly and create the table

export async function initDB() {
  logi('initDB', 'initializing the database');
  // Force the db to load
  await documentsRepository.findFirst();

  database = await Database.load('sqlite:pulsar.db');

  // Create the virtual table for fts
  await database.execute(`
    CREATE VIRTUAL TABLE documents_fts
    USING fts5(filename, text, content="documents");
  `);

  await database.execute(`
    CREATE TRIGGER documents_ai AFTER INSERT ON documents BEGIN
      INSERT INTO documents_fts(filename, text) VALUES (new.filename, new.text);
    END;
  `);
  // CREATE TRIGGER tbl_ad AFTER DELETE ON tbl BEGIN
  //   INSERT INTO fts_idx(fts_idx, rowid, b, c) VALUES('delete', old.a, old.b, old.c);
  // END;
  // CREATE TRIGGER tbl_au AFTER UPDATE ON tbl BEGIN
  //   INSERT INTO fts_idx(fts_idx, rowid, b, c) VALUES('delete', old.a, old.b, old.c);
  //   INSERT INTO fts_idx(rowid, b, c) VALUES (new.a, new.b, new.c);
  // END;
}
