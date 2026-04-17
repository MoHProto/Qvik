import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'accounts',
      columns: [
        { name: 'name', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'threads',
      columns: [
        { name: 'account_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'messages',
      columns: [
        { name: 'thread_id', type: 'string', isIndexed: true },
        { name: 'body', type: 'string' },
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});
