import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { schema } from '@/db/schema';
import { __IS_STORYBOOK__ } from '@/shared/consts';

import migrations from './migrations';

const getAdapter = () => {
  if (__IS_STORYBOOK__) return undefined;

  return new SQLiteAdapter({
    schema,
    dbName: 'pulsar',
    migrations,
    onSetUpError: (e) => console.error(e),
  });
};

export const adapter = getAdapter() as SQLiteAdapter;
