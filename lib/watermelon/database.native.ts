import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { modelClasses } from 'models';

import { migrations } from './migrations';
import { schema } from './schema';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  dbName: 'plainchat',
  jsi: true,
  onSetUpError: (error) => {
    // Intentionally crash in dev; DB setup errors are unrecoverable.
    throw error;
  },
});

export const database = new Database({
  adapter,
  modelClasses: [...modelClasses],
});
