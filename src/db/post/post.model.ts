// @ts-nocheck
import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

export class Post extends Model {
  static table = 'posts';

  static associations = {
    comments: { type: 'has_many', foreignKey: 'post_id' },
  } as Associations;

  @text('title') title;

  @text('body') body;

  @field('is_pinned') isPinned;
}
