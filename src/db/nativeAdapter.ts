import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { confirm } from '@tauri-apps/api/dialog';

import { schema } from '@/db/schema';

export const adapter = new SQLiteAdapter({
  schema,
  dbName: 'pulsar',
  onSetUpError: (error) => {
    console.error(error);
    confirm('Error setting up database. Click to reload the app.', {
      title: 'Error',
      type: 'error',
    });
  },
});

