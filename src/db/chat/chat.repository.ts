import { Collection, Database } from '@nozbe/watermelondb';
import { ChatModel } from './chat.model.ts';
import { assignValues, serialize } from '@/shared/lib/func';

export interface ChatMsg {
  id: Id;
  text: string;
  isUser?: boolean;
  user?: { name: string };
  assistant?: {
    userMsgId: Id;
  };
}

interface Chat {
  id: Id;
  title: string;
  messages: ChatMsg[];
  model: string;
  createdAt: number;
  updatedAt: number;
}
export class ChatsRepository {
  chatsCollection: Collection<ChatModel>;

  constructor(private db: Database) {
    this.chatsCollection = this.db.get('posts');
  }

  async getById(id: Id): Promise<Chat> {
    return this.serialize(await this.chatsCollection.find(id));
  }

  async getAll(): Promise<Chat[]> {
    return this.mapSerialize(await this.chatsCollection.query().fetch());
  }

  async create(data: Dto<Chat>): Promise<Chat> {
    const newPost = await this.db.write(() =>
      this.chatsCollection.create((post) => assignValues(post, data))
    );

    return this.serialize(newPost);
  }

  async update(id: Id, data: UpdateDto<Chat>): Promise<Chat> {
    const post = await this.chatsCollection.find(id);

    const updatedPost = await this.db.write(() => post.update((post) => assignValues(post, data)));

    return this.serialize(updatedPost);
  }

  private serialize(post: ChatModel): Chat {
    return serialize(post, ['id', 'title', 'messages', 'model', 'createdAt', 'updatedAt']);
  }

  private mapSerialize(posts: ChatModel[]): Chat[] {
    return posts.map(this.serialize);
  }
}
