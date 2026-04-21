import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class Message extends Model {
  static table = 'messages';

  @field('thread_id') threadId!: string;
  @field('body') body!: string;
  @field('created_at') createdAt!: number;
  @field('input') input!: string | null;
  @field('is_outgoing') isOutgoing!: boolean | null;
  @field('error') error!: string | null;
}
