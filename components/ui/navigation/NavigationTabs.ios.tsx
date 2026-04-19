/**
 * iOS tab entry. Native `NativeTabs` implementation is preserved in
 * `NavigationTabsNativeIos.tsx`; we currently use the JS `Tabs` navigator (same as
 * Android/web). To restore native tabs: `export { default } from './NavigationTabsNativeIos'`.
 */
export { default } from './NavigationTabsJs';
