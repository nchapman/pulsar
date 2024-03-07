// @ts-nocheck
import { Model } from '../../WatermelonDB';
import { field, text } from '../../WatermelonDB/decorators';
import { postsTable } from './post.schema.ts';

export class PostModel extends Model {
  static table = postsTable.name;

  @text(postsTable.cols.title) title;

  @text(postsTable.cols.body) body;

  @field(postsTable.cols.isPinned) isPinned;
}
