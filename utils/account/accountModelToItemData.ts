import type { AccountItemData } from 'components/account/AccountItem';
import type { Account } from 'models';

export function accountModelToItemData(model: Account): AccountItemData {
  return {
    id: model.id,
    name: model.name,
    avatarUrl: null,
  };
}
