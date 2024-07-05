import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { schema } from '@/db/schema';
import { __IS_STORYBOOK__ } from '@/shared/consts';

const getAdapter = () => {
  if (__IS_STORYBOOK__) return undefined;

  return new SQLiteAdapter({
    schema,
    dbName: 'pulsar',
    onSetUpError: (error) => {
      console.error(error);
      // Database failed to load -- offer the user to reload the app or log out
    },
  });
};

export const adapter = getAdapter() as SQLiteAdapter;
