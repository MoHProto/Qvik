import { Q } from '@nozbe/watermelondb';
import type { Database } from '@nozbe/watermelondb';

import type { Thread } from 'models';

export class ThreadService {
  constructor(private readonly db: Database) {}

  async list(): Promise<Thread[]> {
    return this.db.get<Thread>('threads').query().fetch();
  }

  async listByAccount(accountId: string): Promise<Thread[]> {
    return this.db.get<Thread>('threads').query(Q.where('account_id', accountId)).fetch();
  }
}
