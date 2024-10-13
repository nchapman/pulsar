// @ts-nocheck
import { Model } from '@nozbe/watermelondb';
import { date, json, readonly, text, writer } from '@nozbe/watermelondb/decorators';

import { chatsTable } from './chat.schema.ts';

export class ChatModel extends Model {
  static table = chatsTable.name;

  @text(chatsTable.cols.title) title;

  @json(chatsTable.cols.messages, (json) => json) messages;

  @text(chatsTable.cols.model) model;

  @json(chatsTable.cols.modelSettings, (json) => json) modelSettings;

  @json(chatsTable.cols.agents, (json) => json) agents;

  @json(chatsTable.cols.isPinned, (json) => json) isPinned;

  @json(chatsTable.cols.isArchived, (json) => json) isArchived;

  @readonly @date(chatsTable.cols.createdAt) createdAt;

  @readonly @date(chatsTable.cols.updatedAt) updatedAt;

  @writer async archiveAll() {
    await this.batch(
      this.prepareUpdate((chat) => {
        // eslint-disable-next-line no-param-reassign
        chat.isArchived = true;
      })
    );
  }
}
