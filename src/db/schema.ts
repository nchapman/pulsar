import { appSchema } from '@nozbe/watermelondb';

import { chatSchema } from './chat';
import { downloadSchema } from './download';
import { modelSchema } from './model';
import { postSchema } from './post';

export const schema = appSchema({
  version: 6,
  tables: [postSchema, chatSchema, modelSchema, downloadSchema],
});
