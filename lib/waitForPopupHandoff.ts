import { InteractionManager } from 'react-native';

/**
 * After a popup’s `response` promise resolves, yield one more frame so the RN `Modal`
 * can fully unmount before opening another overlay (avoids stacked-modal glitches).
 */
export function waitForPopupHandoff(): Promise<void> {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}
