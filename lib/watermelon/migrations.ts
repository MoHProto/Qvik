import { addColumns, createTable, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        createTable({
          name: 'messages',
          columns: [
            { name: 'thread_id', type: 'string', isIndexed: true },
            { name: 'body', type: 'string' },
            { name: 'created_at', type: 'number' },
          ],
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        addColumns({
          table: 'threads',
          columns: [{ name: 'root_url', type: 'string' }],
        }),
      ],
    },
    {
      toVersion: 4,
      steps: [
        addColumns({
          table: 'messages',
          columns: [
            { name: 'input', type: 'string', isOptional: true },
            { name: 'label', type: 'string', isOptional: true },
            { name: 'error', type: 'string', isOptional: true },
          ],
        }),
      ],
    },
  ],
});
