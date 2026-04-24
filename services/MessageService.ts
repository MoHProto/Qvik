import type { Database } from '@nozbe/watermelondb';
import { Q } from '@nozbe/watermelondb';

import type { Message } from 'models';
import type { MessageStatus } from 'types/message';

export type MessageCreateParams = {
  threadId: string;
  body: string;
  status: MessageStatus;
  isOutgoing: boolean;
};

export type MessageUpdateParams = {
  id: string;
  body?: string;
  status?: MessageStatus;
  isOutgoing?: boolean;
  buttons?: unknown;
};

export class MessageService {
  constructor(private readonly db: Database) {}

  async getById(id: string): Promise<Message> {
    return this.db.get<Message>('messages').find(id);
  }

  async listByThread(threadId: string): Promise<Message[]> {
    return this.db
      .get<Message>('messages')
      .query(Q.where('thread_id', threadId), Q.sortBy('timestamp', Q.asc))
      .fetch();
  }

  async create(params: MessageCreateParams): Promise<Message> {
    return this.db.write(async () => {
      return this.db.get<Message>('messages').create((message) => {
        message.threadId = params.threadId;
        message.body = params.body;
        message.timestamp = new Date().getTime();
        message.status = params.status;
        message.isOutgoing = params.isOutgoing;
      });
    });
  }

  async update(params: MessageUpdateParams): Promise<Message> {
    return this.db.write(async () => {
      const message = await this.getById(params.id);
      if (!message) {
        throw new Error('Message not found');
      }
      return message.update((message) => {
        if (params.body !== undefined) {
          message.body = params.body;
        }
        if (params.status !== undefined) {
          message.status = params.status;
        }
        if (params.isOutgoing !== undefined) {
          message.isOutgoing = params.isOutgoing;
        }
        if (params.buttons !== undefined) {
          message.buttons = params.buttons;
        }
      });
    });
  }
}
