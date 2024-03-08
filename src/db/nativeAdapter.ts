import { schema } from '@/db/schema';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

export const adapter = new SQLiteAdapter({
  schema,
  dbName: 'pulsar',
  onSetUpError: (error) => {
    console.error(error);
    // Database failed to load -- offer the user to reload the app or log out
  },
});

