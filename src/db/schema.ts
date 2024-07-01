import { appSchema } from '@nozbe/watermelondb';

import { chatSchema } from './chat';
import { downloadSchema } from './download';
import { modelSchema } from './model';

export const schema = appSchema({
  version: 15,
  tables: [chatSchema, modelSchema, downloadSchema],
});
