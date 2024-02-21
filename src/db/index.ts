import { Database, Model } from '@nozbe/watermelondb';
import { Class } from '@nozbe/watermelondb/types';
import { PostsRepository } from './post/post.repository.ts';
import { Post } from './post/post.model.ts';
import { adapter } from './adapter.ts';

const database = new Database({
  adapter,
  modelClasses: [Post] as Class<Model>[],
});

// Repositories
export const postsRepository = new PostsRepository(database);
