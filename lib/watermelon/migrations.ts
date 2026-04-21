import {
  addColumns,
  createTable,
  schemaMigrations,
  unsafeExecuteSql,
} from '@nozbe/watermelondb/Schema/migrations';

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
    {
      toVersion: 5,
      steps: [
        addColumns({
          table: 'threads',
          columns: [{ name: 'base_url', type: 'string' }],
        }),
        unsafeExecuteSql('UPDATE threads SET base_url = root_url;'),
      ],
    },
    {
      toVersion: 6,
      steps: [
        addColumns({
          table: 'threads',
          columns: [{ name: 'base_path', type: 'string' }],
        }),
        unsafeExecuteSql('UPDATE threads SET base_path = base_url;'),
      ],
    },
    {
      toVersion: 7,
      steps: [
        addColumns({
          table: 'messages',
          columns: [{ name: 'is_outgoing', type: 'boolean', isOptional: true }],
        }),
        unsafeExecuteSql('UPDATE messages SET is_outgoing = 0 WHERE is_outgoing IS NULL;'),
        unsafeExecuteSql('ALTER TABLE messages DROP COLUMN label;'),
      ],
    },
  ],
});
