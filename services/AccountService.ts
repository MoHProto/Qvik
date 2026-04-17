import type { Database } from '@nozbe/watermelondb';

import type { Account } from 'models';

/**
 * Local persistence for accounts (WatermelonDB). UI should call these from
 * React Query (`queryFn` / `mutationFn`), not use Watermelon directly in components.
 */
export class AccountService {
  constructor(private readonly db: Database) {}

  async list(): Promise<Account[]> {
    return this.db.get<Account>('accounts').query().fetch();
  }

  async findById(id: string): Promise<Account | null> {
    try {
      return await this.db.get<Account>('accounts').find(id);
    } catch {
      return null;
    }
  }
}
