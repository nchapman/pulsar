import { Database, Model } from '@nozbe/watermelondb';
import { Class } from '@nozbe/watermelondb/types';
import DatabasePlugin from 'tauri-plugin-sql';

import { logi } from '@/shared/lib/Logger';

import { ChatModel, ChatsRepository } from './chat';
import { DocumentModel, DocumentRepository } from './document';
import { adapter } from './nativeAdapter';
import { PostModel, PostsRepository } from './post';

const database = new Database({
  adapter,
  modelClasses: [PostModel, ChatModel, DocumentModel] as Class<Model>[],
});

// FTS is not supported by watermelonDB
// So we are going to hook up to the database directly and create the table

export async function initDB() {
  // Force the db to load
  await database.localStorage.get('dbInitialized');

  const db = await DatabasePlugin.load('sqlite:pulsar.db');
  await db.execute(`
    CREATE VIRTUAL TABLE IF NOT EXISTS documents_fts
    USING fts5(title, content);
  `);

  logi('DB', 'database initialized');
}

// Repositories
export const postsRepository = new PostsRepository(database);
export const chatsRepository = new ChatsRepository(database);
export const documentsRepository = new DocumentRepository(database);
