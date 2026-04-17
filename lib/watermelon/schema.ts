import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 4,
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
        { name: 'root_url', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'messages',
      columns: [
        { name: 'thread_id', type: 'string', isIndexed: true },
        { name: 'body', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'input', type: 'string', isOptional: true },
        { name: 'label', type: 'string', isOptional: true },
        { name: 'error', type: 'string', isOptional: true },
      ],
    }),
  ],
});
