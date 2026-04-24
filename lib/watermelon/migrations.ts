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
    {
      toVersion: 8,
      steps: [
        unsafeExecuteSql('ALTER TABLE messages RENAME COLUMN created_at TO timestamp;'),
      ],
    },
    {
      toVersion: 9,
      steps: [
        unsafeExecuteSql(
          'create index if not exists "messages_timestamp" on "messages" ("timestamp");',
        ),
      ],
    },
    {
      toVersion: 10,
      steps: [
        unsafeExecuteSql(
          'create index if not exists "threads_url" on "threads" ("url");',
        ),
      ],
    },
    {
      toVersion: 11,
      steps: [
        unsafeExecuteSql(
          'ALTER TABLE messages ADD COLUMN "status" TEXT;',
        ),
        unsafeExecuteSql(
          'UPDATE messages SET "status" = CASE WHEN COALESCE("is_outgoing", 0) = 1 THEN \'input\' WHEN NULLIF(TRIM(COALESCE("error", \'\')), \'\') IS NOT NULL THEN \'error\' ELSE \'success\' END, "body" = CASE WHEN COALESCE("is_outgoing", 0) = 1 THEN COALESCE(NULLIF(TRIM(COALESCE("input", \'\')), \'\'), "body", \'\') WHEN NULLIF(TRIM(COALESCE("error", \'\')), \'\') IS NOT NULL THEN COALESCE("error", "body", \'\') ELSE "body" END;',
        ),
        unsafeExecuteSql('ALTER TABLE messages DROP COLUMN "input";'),
        unsafeExecuteSql('ALTER TABLE messages DROP COLUMN "error";'),
        unsafeExecuteSql('ALTER TABLE messages DROP COLUMN "is_outgoing";'),
        unsafeExecuteSql(
          'create index if not exists "messages_status" on "messages" ("status");',
        ),
      ],
    },
    {
      toVersion: 12,
      steps: [
        addColumns({
          table: 'messages',
          columns: [{ name: 'is_outgoing', type: 'boolean', isOptional: true }],
        }),
        unsafeExecuteSql(
          'UPDATE messages SET is_outgoing = CASE WHEN status IN (\'input\', \'pending\') THEN 1 ELSE 0 END WHERE is_outgoing IS NULL;',
        ),
        unsafeExecuteSql(
          'create index if not exists "messages_is_outgoing" on "messages" ("is_outgoing");',
        ),
      ],
    },
    {
      toVersion: 13,
      steps: [
        addColumns({
          table: 'accounts',
          columns: [{ name: 'is_active', type: 'boolean', isOptional: true }],
        }),
        unsafeExecuteSql(
          'UPDATE accounts SET is_active = 1 WHERE is_active IS NULL;',
        ),
        unsafeExecuteSql(
          'create index if not exists "accounts_is_active" on "accounts" ("is_active");',
        ),
      ],
    },
    {
      toVersion: 14,
      steps: [
        addColumns({
          table: 'threads',
          columns: [{ name: 'menu', type: 'string', isOptional: true }],
        }),
        unsafeExecuteSql(
          "UPDATE threads SET menu = '{}' WHERE menu IS NULL;",
        ),
        addColumns({
          table: 'messages',
          columns: [{ name: 'buttons', type: 'string', isOptional: true }],
        }),
        unsafeExecuteSql(
          "UPDATE messages SET buttons = '{}' WHERE buttons IS NULL;",
        ),
      ],
    },
    {
      toVersion: 15,
      steps: [
        addColumns({
          table: 'threads',
          columns: [{ name: 'description', type: 'string', isOptional: true }],
        }),
        unsafeExecuteSql(
          "UPDATE threads SET description = '' WHERE description IS NULL;",
        ),
      ],
    },
    {
      toVersion: 16,
      steps: [
        addColumns({
          table: 'accounts',
          columns: [{ name: 'private_key', type: 'string', isOptional: true }],
        }),
        unsafeExecuteSql(
          "UPDATE accounts SET private_key = '' WHERE private_key IS NULL;",
        ),
        addColumns({
          table: 'threads',
          columns: [{ name: 'is_authorized', type: 'boolean', isOptional: true }],
        }),
        unsafeExecuteSql(
          'UPDATE threads SET is_authorized = 0 WHERE is_authorized IS NULL;',
        ),
        unsafeExecuteSql(
          'create index if not exists "threads_is_authorized" on "threads" ("is_authorized");',
        ),
      ],
    },
  ],
});
