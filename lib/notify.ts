import Toast from 'react-native-toast-message';

export type NotifyOptions = {
  /** Defaults to 3000 ms */
  duration?: number;
  /** Runs when the toast is pressed; the toast is dismissed afterward. */
  onPress?: () => void;
};

function show(
  type: 'success' | 'error' | 'info',
  title: string,
  message?: string,
  options?: NotifyOptions
) {
  const onPress = options?.onPress;
  Toast.show({
    type,
    text1: title,
    text2: message,
    visibilityTime: options?.duration,
    ...(onPress
      ? {
          onPress: () => {
            onPress();
            Toast.hide();
          },
        }
      : {}),
  });
}

/** Standard in-app notifications (top toast). */
export const notify = {
  success: (title: string, message?: string, options?: NotifyOptions) =>
    show('success', title, message, options),

  error: (title: string, message?: string, options?: NotifyOptions) =>
    show('error', title, message, options),

  info: (title: string, message?: string, options?: NotifyOptions) =>
    show('info', title, message, options),

  /** Hide the visible toast immediately */
  hide: () => Toast.hide(),
};
