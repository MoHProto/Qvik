import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 7,
  tables: [
    tableSchema({
      name: 'accounts',
      columns: [{ name: 'name', type: 'string' }],
    }),
    tableSchema({
      name: 'threads',
      columns: [
        { name: 'account_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'url', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'messages',
      columns: [
        { name: 'thread_id', type: 'string', isIndexed: true },
        { name: 'body', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'input', type: 'string', isOptional: true },
        { name: 'is_outgoing', type: 'boolean', isOptional: true },
        { name: 'error', type: 'string', isOptional: true },
      ],
    }),
  ],
});
