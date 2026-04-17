import { database } from 'lib/watermelon';

import { AccountService } from './AccountService';
import { MessageService } from './MessageService';
import { ThreadService } from './ThreadService';

export { AccountService } from './AccountService';
export { MessageService } from './MessageService';
export { ThreadService } from './ThreadService';

export const accountService = new AccountService(database);
export const messageService = new MessageService(database);
export const threadService = new ThreadService(database);
