import type { Database } from '@nozbe/watermelondb';
import { Q } from '@nozbe/watermelondb';

import type { Account } from 'models';
import { createEd25519SeedHex } from 'utils/crypto/ed25519';

/**
 * Local persistence for accounts (WatermelonDB). UI should call these from
 * React Query (`queryFn` / `mutationFn`), not use Watermelon directly in components.
 */
export class AccountService {
  constructor(private readonly db: Database) {}

  private async ensurePrivateKey(account: Account): Promise<Account> {
    if (typeof account.privateKey === 'string' && account.privateKey.trim().length === 64) {
      return account;
    }
    return this.db.write(async () => {
      return account.update((acc) => {
        acc.privateKey = createEd25519SeedHex();
      });
    });
  }

  async list(): Promise<Account[]> {
    return this.db.get<Account>('accounts').query().fetch();
  }

  async getActive(): Promise<Account | null> {
    const rows = await this.db
      .get<Account>('accounts')
      .query(Q.where('is_active', true))
      .fetch();
    const account = rows[0] ?? null;
    return account ? await this.ensurePrivateKey(account) : null;
  }

  async findById(id: string): Promise<Account | null> {
    try {
      const account = await this.db.get<Account>('accounts').find(id);
      return await this.ensurePrivateKey(account);
    } catch {
      return null;
    }
  }

  async create(params: { name: string }): Promise<Account> {
    const name = params.name.trim();
    return this.db.write(async () => {
      const existing = await this.db.get<Account>('accounts').query().fetch();
      for (const row of existing) {
        await row.update((acc) => {
          acc.isActive = false;
        });
      }
      return this.db.get<Account>('accounts').create((account) => {
        account.name = name;
        account.isActive = true;
        account.privateKey = createEd25519SeedHex();
      });
    });
  }

  async update(params: { id: string; name: string }): Promise<Account> {
    const name = params.name.trim();
    return this.db.write(async () => {
      const existing = await this.db.get<Account>('accounts').query().fetch();
      for (const row of existing) {
        await row.update((acc) => {
          acc.isActive = row.id === params.id;
        });
      }
      const account = await this.db.get<Account>('accounts').find(params.id);
      return account.update((acc) => {
        acc.name = name;
        acc.isActive = true;
      });
    });
  }

  async setActive(accountId: string): Promise<void> {
    await this.db.write(async () => {
      const existing = await this.db.get<Account>('accounts').query().fetch();
      for (const row of existing) {
        await row.update((acc) => {
          acc.isActive = row.id === accountId;
        });
      }
    });
  }
}
