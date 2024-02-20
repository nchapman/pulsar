// eslint-disable-next-line max-classes-per-file
import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';

export class Post extends Model {
  static table = 'posts';

  static associations = {
    comments: { type: 'has_many', foreignKey: 'post_id' },
  };

  @text('title') title: string;

  @text('body') body;

  @field('is_pinned') isPinned;
}

export class Comment extends Model {
  static table = 'comments';

  static associations = {
    posts: { type: 'belongs_to', key: 'post_id' },
  };
}
