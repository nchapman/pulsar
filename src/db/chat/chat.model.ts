// @ts-nocheck
import { Model } from '@nozbe/watermelondb';
import { date, json, text } from '@nozbe/watermelondb/decorators';

export class ChatModel extends Model {
  static table = 'chats';

  @text('title') title;

  @json('messages') messages;

  @text('model') model;

  @date('created_at') createdAt;

  @date('updated_at') updatedAt;
}
