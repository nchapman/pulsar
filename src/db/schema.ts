import { appSchema } from '@nozbe/watermelondb';

import { modelSchema } from '@/db/model';

import { chatSchema } from './chat';
import { postSchema } from './post';

export const schema = appSchema({
  version: 4,
  tables: [postSchema, chatSchema, modelSchema],
});
