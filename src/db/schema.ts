import { appSchema } from '@nozbe/watermelondb';

import { agentSchema } from './agent';
import { chatSchema } from './chat';
import { downloadSchema } from './download';
import { modelSchema } from './model';
import { modelFileSchema } from './model-file';

export const schema = appSchema({
  version: 28,

  tables: [chatSchema, modelFileSchema, downloadSchema, modelSchema, agentSchema],
});
