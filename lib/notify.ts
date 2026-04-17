import Toast from 'react-native-toast-message';

type NotifyOptions = {
  /** Defaults to 3000 ms */
  duration?: number;
};

function show(
  type: 'success' | 'error' | 'info',
  title: string,
  message?: string,
  options?: NotifyOptions
) {
  Toast.show({
    type,
    text1: title,
    text2: message,
    visibilityTime: options?.duration,
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
