import { appSchema } from '@nozbe/watermelondb';

import { chatSchema } from './chat';
import { downloadSchema } from './download';
import { modelSchema } from './model';

export const schema = appSchema({
  version: 16,
  tables: [chatSchema, modelSchema, downloadSchema],
});
