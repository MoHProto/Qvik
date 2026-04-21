import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class Thread extends Model {
  static table = 'threads';

  @field('account_id') accountId!: string;
  @field('title') title!: string;
  @field('url') url!: string;
}
