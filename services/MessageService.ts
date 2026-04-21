import { Q } from '@nozbe/watermelondb';
import type { Database } from '@nozbe/watermelondb';

import type { Message } from 'models';

export class MessageService {
  constructor(private readonly db: Database) {}

  async listByThread(threadId: string): Promise<Message[]> {
    return this.db
      .get<Message>('messages')
      .query(Q.where('thread_id', threadId), Q.sortBy('timestamp', Q.desc))
      .fetch();
  }
}
