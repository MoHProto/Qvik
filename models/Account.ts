import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class Account extends Model {
  static table = 'accounts';

  @field('name') name!: string;
}
