import { appSchema } from '@nozbe/watermelondb';
import { postSchema } from './post';

export const schema = appSchema({
  version: 1,
  tables: [postSchema],
});
