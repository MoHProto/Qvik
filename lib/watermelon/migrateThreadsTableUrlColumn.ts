import { Paths } from 'expo-file-system';
import { openDatabaseSync } from 'expo-sqlite';
import { Platform } from 'react-native';

const DB_FILE = 'plainchat.db';

/** Same directory WatermelonDB uses for `dbName: 'plainchat'` (not Expo SQLite’s default `…/SQLite/`). */
function watermelonDatabaseDirectory(): string {
  const path = Paths.document.uri.replace(/^file:\/\//, '');
  if (Platform.OS === 'android') {
    return path.replace(/\/files\/?$/, '');
  }
  return path;
}

/**
 * Older migrations added `root_url`, `base_url`, and `base_path` on `threads`, while the app model
 * and schema use a single `url` column. SQLite migration SQL cannot branch on column presence, so we
 * normalize the table here (same file as Watermelon) before the adapter runs migrations.
 */
export function migrateThreadsTableUrlColumnBeforeAdapter(): void {
  let db: ReturnType<typeof openDatabaseSync> | undefined;
  try {
    db = openDatabaseSync(DB_FILE, undefined, watermelonDatabaseDirectory());
  } catch {
    return;
  }
  try {
    const exists = db.getAllSync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'threads';",
    );
    if (exists.length === 0) {
      return;
    }

    const cols = db.getAllSync<{ name: string }>('PRAGMA table_info(threads);');
    const names = new Set(cols.map((c) => c.name));

    if (names.has('url')) {
      return;
    }

    db.execSync('BEGIN IMMEDIATE;');

    if (names.has('base_path')) {
      db.execSync('ALTER TABLE threads RENAME COLUMN "base_path" TO "url";');
      if (names.has('root_url')) {
        db.execSync('ALTER TABLE threads DROP COLUMN "root_url";');
      }
      if (names.has('base_url')) {
        db.execSync('ALTER TABLE threads DROP COLUMN "base_url";');
      }
    } else if (names.has('root_url') || names.has('base_url')) {
      db.execSync('ALTER TABLE threads ADD COLUMN "url" TEXT NOT NULL DEFAULT \'\';');
      db.execSync(
        'UPDATE threads SET "url" = COALESCE(NULLIF(TRIM(COALESCE("base_url", \'\')), \'\'), NULLIF(TRIM(COALESCE("root_url", \'\')), \'\'), \'\');',
      );
      if (names.has('root_url')) {
        db.execSync('ALTER TABLE threads DROP COLUMN "root_url";');
      }
      if (names.has('base_url')) {
        db.execSync('ALTER TABLE threads DROP COLUMN "base_url";');
      }
    } else {
      db.execSync('ALTER TABLE threads ADD COLUMN "url" TEXT NOT NULL DEFAULT \'\';');
    }

    db.execSync('CREATE INDEX IF NOT EXISTS "threads_url" ON "threads" ("url");');
    db.execSync('COMMIT;');
  } catch (e) {
    try {
      db.execSync('ROLLBACK;');
    } catch {
      // ignore
    }
    throw e;
  } finally {
    try {
      db.closeSync();
    } catch {
      // ignore
    }
  }
}
