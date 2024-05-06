import { Database, Model } from '@nozbe/watermelondb';
import { Class } from '@nozbe/watermelondb/types';

import { ChatModel, ChatsRepository } from './chat';
import { DocumentModel, DocumentRepository } from './document';
import { adapter } from './nativeAdapter';
import { PostModel, PostsRepository } from './post';

const database = new Database({
  adapter,
  modelClasses: [PostModel, ChatModel, DocumentModel] as Class<Model>[],
});

// Repositories
export const postsRepository = new PostsRepository(database);
export const chatsRepository = new ChatsRepository(database);
export const documentsRepository = new DocumentRepository(database);
