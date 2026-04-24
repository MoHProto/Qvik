import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 15,
  tables: [
    tableSchema({
      name: 'accounts',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'is_active', type: 'boolean', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'threads',
      columns: [
        { name: 'account_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'url', type: 'string', isIndexed: true },
        { name: 'menu', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'messages',
      columns: [
        { name: 'thread_id', type: 'string', isIndexed: true },
        { name: 'body', type: 'string' },
        { name: 'timestamp', type: 'number', isIndexed: true },
        { name: 'status', type: 'string', isIndexed: true },
        { name: 'is_outgoing', type: 'boolean', isIndexed: true },
        { name: 'buttons', type: 'string' },
      ],
    }),
  ],
});
