declare module 'expo-asset/build/resolveAssetSource' {
  import type { ImageSourcePropType } from 'react-native';

  function resolveAssetSource(
    source: ImageSourcePropType | null | undefined,
  ): { uri: string; width: number; height: number } | null;

  export default resolveAssetSource;
}
