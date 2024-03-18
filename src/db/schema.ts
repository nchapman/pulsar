import { appSchema } from '@nozbe/watermelondb';

import { chatSchema } from './chat';
import { postSchema } from './post';

export const schema = appSchema({
  version: 1,
  tables: [postSchema, chatSchema],
});
