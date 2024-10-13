import { Collection, Database, Q } from '@nozbe/watermelondb';

import { FileData } from '@/features/upload-file';
import { assignValues, serialize } from '@/shared/lib/func';

import { ChatModel } from './chat.model.ts';
import { chatsTable } from './chat.schema.ts';

export interface ChatMsg {
  id: Id;
  text: string;
  file?: FileData;
  isUser?: boolean;
  user?: { name: string };
  assistant?: {
    userMsgId: Id;
    input: string;
  };
  options?: string[];
  currentOption?: number;
}

export interface ModelSettings {
  temp: number;
  topP: number;
  maxLength: number;
  stopTokens: string[];
}

export interface Chat {
  id: Id;
  title: string;
  messages: ChatMsg[];
  isPinned: boolean;
  isArchived: boolean;
  model: string;
  modelSettings?: ModelSettings;
  createdAt: number;
  updatedAt: number;
  agents: {
    selected: Id[];
    active: Id[];
  };
}

interface ListParams {
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  search?: string;
}

export class ChatsRepository {
  chatsCollection: Collection<ChatModel>;

  constructor(private db: Database) {
    this.chatsCollection = this.db.get(chatsTable.name);
  }

  async getById(id: Id): Promise<Chat> {
    return this.serialize(await this.chatsCollection.find(id));
  }

  async getAll(params?: ListParams, archived = false): Promise<Chat[]> {
    const { limit = 10, offset = 0, order = 'desc', search } = params || {};

    const query: Q.Clause[] = [
      Q.where(chatsTable.cols.isArchived, Q.eq(archived ? 'true' : 'false')),
      Q.sortBy(chatsTable.cols.updatedAt, Q[order]),
      Q.skip(offset),
      Q.take(limit),
    ];

    if (search) {
      query.push(Q.where(chatsTable.cols.title, Q.like(`%${search}%`)));
    }

    return this.mapSerialize(await this.chatsCollection.query(...query).fetch());
  }

  async create(data: Dto<Chat>): Promise<Chat> {
    const newChat = await this.db.write(() =>
      this.chatsCollection.create((d) => assignValues(d, data))
    );

    return this.serialize(newChat);
  }

  async update(id: Id, data: UpdateDto<Chat>): Promise<Chat> {
    const chat = await this.chatsCollection.find(id);

    try {
      const updatedChat = await this.db.write(() =>
        chat.update((chat) => {
          assignValues(chat, data);
        })
      );

      return this.serialize(updatedChat);
    } catch (e) {
      return chat;
    }
  }

  async remove(id: Id): Promise<void> {
    const chat = await this.chatsCollection.find(id);
    await this.db.write(() => chat.destroyPermanently());
  }

  async archiveAll(): Promise<void> {
    await this.db.adapter.unsafeExecute({
      sqls: [[`update ${chatsTable.name} set ${chatsTable.cols.isArchived} = "true"`, []]],
    });
  }

  async removeAll(): Promise<void> {
    await this.db.adapter.unsafeExecute({
      sqls: [[`delete from ${chatsTable.name}`, []]],
    });
  }

  private serialize(chat: ChatModel): Chat {
    return serialize(chat, [
      'id',
      'title',
      'messages',
      'model',
      'agents',
      'modelSettings',
      'createdAt',
      'updatedAt',
      'isArchived',
      'isPinned',
    ]);
  }

  private mapSerialize(chats: ChatModel[]): Chat[] {
    return chats.map(this.serialize);
  }
}
