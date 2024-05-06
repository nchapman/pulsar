// @ts-nocheck
import { Model } from '@nozbe/watermelondb';
import { date, json, readonly, text } from '@nozbe/watermelondb/decorators';

import { chatsTable } from './chat.schema';

export class ChatModel extends Model {
  static table = chatsTable.name;

  @text(chatsTable.cols.title) title;

  @json(chatsTable.cols.messages, (json) => json) messages;

  @text(chatsTable.cols.model) model;

  @json(chatsTable.cols.isPinned, (json) => json) isPinned;

  @json(chatsTable.cols.isArchived, (json) => json) isArchived;

  @readonly @date(chatsTable.cols.createdAt) createdAt;

  @readonly @date(chatsTable.cols.updatedAt) updatedAt;
}
