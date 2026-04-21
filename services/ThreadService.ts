import type { Database } from '@nozbe/watermelondb';
import { Q } from '@nozbe/watermelondb';

import type { Thread } from 'models';

export class ThreadService {
  constructor(private readonly db: Database) {}

  async list(): Promise<Thread[]> {
    return this.db.get<Thread>('threads').query().fetch();
  }

  async listByAccount(accountId: string): Promise<Thread[]> {
    return this.db.get<Thread>('threads').query(Q.where('account_id', accountId)).fetch();
  }

  async create(params: { accountId: string; title: string; url: string }): Promise<Thread> {
    return this.db.write(async () => {
      return this.db.get<Thread>('threads').create((thread) => {
        thread.accountId = params.accountId;
        thread.title = params.title;
        thread.url = params.url;
      });
    });
  }

  async findById(id: string): Promise<Thread | undefined> {
    return this.db.get<Thread>('threads').find(id);
  }
}
