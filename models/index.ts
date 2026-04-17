import { Account } from './Account';
import { Message } from './Message';
import { Thread } from './Thread';

export { Account, Message, Thread };

export const modelClasses = [Account, Thread, Message] as const;
