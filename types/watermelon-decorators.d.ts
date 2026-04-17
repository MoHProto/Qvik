/**
 * WatermelonDB's `field` decorator is implemented with the legacy
 * (target, key, descriptor) shape, while the published typings use
 * `PropertyDecorator`. TypeScript 5 then reports errors on every `@field`.
 * Treating the decorator as `any` here removes those errors globally.
 */
declare module '@nozbe/watermelondb/decorators/field' {
  import type { ColumnName } from '@nozbe/watermelondb/Schema';

  function field(columnName: ColumnName): any;
  export default field;
}

/** Ensure imports from `@nozbe/watermelondb/decorators` see the same `field` type. */
declare module '@nozbe/watermelondb/decorators' {
  import type { ColumnName } from '@nozbe/watermelondb/Schema';

  export function field(columnName: ColumnName): any;
}
