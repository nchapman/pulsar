import { Database, Model } from '@nozbe/watermelondb';
import { Class } from '@nozbe/watermelondb/types';
// import { adapter } from './adapter.ts';
import { adapter } from './nativeAdapter';
import { PostsRepository, PostModel } from './post';
import { ChatModel, ChatsRepository } from './chat';

const database = new Database({
  adapter,
  modelClasses: [PostModel, ChatModel] as Class<Model>[],
});

// Repositories
export const postsRepository = new PostsRepository(database);
export const chatsRepository = new ChatsRepository(database);
