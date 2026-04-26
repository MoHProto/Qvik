import { Paths } from 'expo-file-system';
import { openDatabaseSync } from 'expo-sqlite';
import { Platform } from 'react-native';

const DB_FILE = 'plainchat.db';

/** Same directory WatermelonDB uses for `dbName: 'plainchat'`. */
function watermelonDatabaseDirectory(): string {
  const path = Paths.document.uri.replace(/^file:\/\//, '');
  if (Platform.OS === 'android') {
    return path.replace(/\/files\/?$/, '');
  }
  return path;
}

/**
 * Ensures `messages.path` exists before Watermelon opens. Some installs reached schema version 17
 * without this column (e.g. version bumped before the migration ran). `PRAGMA table_info` is used so
 * this is safe to run on every launch and idempotent if `path` is already present.
 */
export function migrateMessagesPathColumnBeforeAdapter(): void {
  let db: ReturnType<typeof openDatabaseSync> | undefined;
  try {
    db = openDatabaseSync(DB_FILE, undefined, watermelonDatabaseDirectory());
  } catch {
    return;
  }

  try {
    const exists = db.getAllSync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'messages';",
    );
    if (exists.length === 0) {
      return;
    }

    const cols = db.getAllSync<{ name: string }>('PRAGMA table_info(messages);');
    const names = new Set(cols.map((c) => c.name));

    if (names.has('path')) {
      return;
    }

    db.execSync('ALTER TABLE messages ADD COLUMN "path" TEXT;');
  } finally {
    try {
      db.closeSync();
    } catch {
      // ignore
    }
  }
}
