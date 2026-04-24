import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

import type { MessageStatus } from "types/message";

export class Message extends Model {
  static table = "messages";

  @field("thread_id") threadId!: string;
  @field("body") body!: string;
  @field("timestamp") timestamp!: number;
  @field("status") status!: MessageStatus;
  @field("is_outgoing") isOutgoing!: boolean;
  @field("buttons") private buttonsRaw!: string;

  get buttons(): { label: string; url: string }[] {
    try {
      return JSON.parse(this.buttonsRaw ?? "[]");
    } catch {
      return [];
    }
  }

  set buttons(value: { label: string; url: string }[]) {
    this.buttonsRaw = JSON.stringify(value ?? []);
  }
}
