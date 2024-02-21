import { Collection, Database } from '@nozbe/watermelondb';
import { Post } from './post.model.ts';
import { assignValues, serialize } from '@/shared/lib/func';

interface IPost {
  id: Id;
  title: string;
  body: string;
}
export class PostsRepository {
  postsCollection: Collection<Post>;

  constructor(private db: Database) {
    this.postsCollection = this.db.get('posts');
  }

  async getById(id: Id): Promise<IPost> {
    return this.serialize(await this.postsCollection.find(id));
  }

  async getAll(): Promise<IPost[]> {
    return this.mapSerialize(await this.postsCollection.query().fetch());
  }

  async create(data: Dto<IPost>): Promise<IPost> {
    const newPost = await this.db.write(() =>
      this.postsCollection.create((post) => assignValues(post, data))
    );

    return this.serialize(newPost);
  }

  async update(id: Id, data: UpdateDto<IPost>): Promise<IPost> {
    const post = await this.postsCollection.find(id);

    const updatedPost = await this.db.write(() => post.update((post) => assignValues(post, data)));

    return this.serialize(updatedPost);
  }

  serialize(post: Post): IPost {
    return serialize(post, ['id', 'title', 'body']);
  }

  mapSerialize(posts: Post[]): IPost[] {
    return posts.map(this.serialize);
  }
}
