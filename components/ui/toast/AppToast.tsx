import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { iosToastConfig } from './IosToastBanner';

/**
 * Global toast host. Renders once at the app root; use `notify` from `lib/notify` to show messages.
 */
export function AppToast() {
  const insets = useSafeAreaInsets();
  return (
    <Toast
      config={iosToastConfig}
      position="top"
      topOffset={insets.top + 8}
      visibilityTime={3000}
      autoHide
      swipeable
    />
  );
}
