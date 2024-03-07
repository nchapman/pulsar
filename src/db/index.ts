import { Database, Model } from '../WatermelonDB';
import { type Class } from '../WatermelonDB/types';
import { PostsRepository, PostModel } from './post';
import { ChatModel, ChatsRepository } from './chat';
import { adapter } from './adapter';

const database = new Database({
  adapter,
  modelClasses: [PostModel, ChatModel] as Class<Model>[],
});

// Repositories
export const postsRepository = new PostsRepository(database);
export const chatsRepository = new ChatsRepository(database);
