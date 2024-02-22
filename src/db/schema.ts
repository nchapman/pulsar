import { appSchema } from '@nozbe/watermelondb';
import { postSchema } from './post';
import { chatSchema } from './chat';

export const schema = appSchema({
  version: 2,
  tables: [postSchema, chatSchema],
});
