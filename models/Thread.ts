import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export class Thread extends Model {
  static table = "threads";

  @field("account_id") accountId!: string;
  @field("title") title!: string;
  @field("description") description!: string;
  @field("url") url!: string;
  @field("menu") private menuRaw!: string;
  @field("is_authorized") isAuthorized!: boolean;

  get menu(): { label: string; url: string }[] {
    try {
      return JSON.parse(this.menuRaw ?? "[]");
    } catch {
      return [];
    }
  }

  set menu(value: { label: string; url: string }[]) {
    this.menuRaw = JSON.stringify(value ?? []);
  }
}
