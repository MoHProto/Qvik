import type { Database } from '@nozbe/watermelondb';
import { Q } from '@nozbe/watermelondb';

import type { Thread } from 'models';

export type ThreadUpdateParams = {
  id: string;
  title?: string;
  description?: string;
  menu?: unknown;
};

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

  async update(params: ThreadUpdateParams): Promise<Thread> {
    return this.db.write(async () => {
      const thread = await this.findById(params.id);
      if (!thread) {
        throw new Error('Thread not found');
      }
      return thread.update((thread) => {
        if (params.title !== undefined) {
          thread.title = params.title;
        }
        if (params.description !== undefined) {
          thread.description = params.description;
        }
        if (params.menu !== undefined) {
          thread.menu = params.menu;
        }
      });
    });
  }
}
