import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { toastConfig } from './ToastBanner';

/**
 * Global toast host. Renders once at the app root; use `notify` from `lib/notify` to show messages.
 */
export function AppToast() {
  const insets = useSafeAreaInsets();
  return (
    <Toast
      config={toastConfig}
      position="top"
      topOffset={insets.top + 8}
      visibilityTime={3000}
      autoHide
      swipeable
    />
  );
}
