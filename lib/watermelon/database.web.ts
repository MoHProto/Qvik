import { Database } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';

import { modelClasses } from 'models';

import { migrations } from './migrations';
import { schema } from './schema';

/** Web uses LokiJS + IndexedDB; SQLite (better-sqlite3 / native) is not available. */
const adapter = new LokiJSAdapter({
  schema,
  migrations,
  dbName: 'plainchat',
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  onSetUpError: (error) => {
    throw error;
  },
});

export const database = new Database({
  adapter,
  modelClasses: [...modelClasses],
});
