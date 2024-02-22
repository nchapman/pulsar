import { Collection, Database } from '@nozbe/watermelondb';
import { PostModel } from './post.model.ts';
import { assignValues, serialize } from '@/shared/lib/func';
import { postsTable } from './post.schema.ts';

interface Post {
  id: Id;
  title: string;
  body: string;
}
export class PostsRepository {
  postsCollection: Collection<PostModel>;

  constructor(private db: Database) {
    this.postsCollection = this.db.get(postsTable.name);
  }

  async getById(id: Id): Promise<Post> {
    return this.serialize(await this.postsCollection.find(id));
  }

  async getAll(): Promise<Post[]> {
    return this.mapSerialize(await this.postsCollection.query().fetch());
  }

  async create(data: Dto<Post>): Promise<Post> {
    const newPost = await this.db.write(() =>
      this.postsCollection.create((post) => assignValues(post, data))
    );

    return this.serialize(newPost);
  }

  async update(id: Id, data: UpdateDto<Post>): Promise<Post> {
    const post = await this.postsCollection.find(id);

    const updatedPost = await this.db.write(() => post.update((post) => assignValues(post, data)));

    return this.serialize(updatedPost);
  }

  private serialize(post: PostModel): Post {
    return serialize(post, ['id', 'title', 'body']);
  }

  private mapSerialize(posts: PostModel[]): Post[] {
    return posts.map(this.serialize);
  }
}
