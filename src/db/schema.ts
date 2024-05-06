import { appSchema } from '@nozbe/watermelondb';

import { chatSchema } from './chat';
import { documentSchema } from './document';
import { postSchema } from './post';

export const schema = appSchema({
  version: 7,
  tables: [postSchema, chatSchema, documentSchema],
});
