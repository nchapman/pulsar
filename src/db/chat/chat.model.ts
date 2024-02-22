// @ts-nocheck
import { Model } from '@nozbe/watermelondb';
import { date, json, text } from '@nozbe/watermelondb/decorators';
import { chatsTable } from './chat.schema.ts';

export class ChatModel extends Model {
  static table = chatsTable.name;

  @text(chatsTable.cols.title) title;

  @json(chatsTable.cols.messages, (json) => json) messages;

  @text(chatsTable.cols.model) model;

  @date(chatsTable.cols.createdAt) createdAt;

  @date(chatsTable.cols.updatedAt) updatedAt;
}
