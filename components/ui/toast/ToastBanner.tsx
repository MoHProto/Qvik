import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { Platform, Pressable, Text, useColorScheme, View } from 'react-native';
import type {
  ToastConfig,
  ToastConfigParams,
} from 'react-native-toast-message';
import { StyleSheet } from 'react-native-unistyles';

/** iOS system semantic colors (icons) */
const ACCENT = {
  success: '#34C759',
  error: '#FF3B30',
  info: '#007AFF',
} as const;

const VARIANT_ICON = {
  success: 'checkmark-circle' as const,
  error: 'close-circle' as const,
  info: 'information-circle' as const,
};

type Variant = keyof typeof ACCENT;

type BannerProps = ToastConfigParams<unknown> & { variant: Variant };

function IosToastBanner({ text1, text2, onPress, variant }: BannerProps) {
  const colorScheme = useColorScheme();
  const tint =
    colorScheme === 'dark'
      ? ('systemThinMaterialDark' as const)
      : ('systemThinMaterialLight' as const);

  const intensity =
    Platform.OS === 'ios' ? 80 : Platform.OS === 'android' ? 50 : 65;

  const inner = (
    <View style={styles.inner}>
      <View style={styles.iconWrap}>
        <Ionicons
          name={VARIANT_ICON[variant]}
          size={24}
          color={ACCENT[variant]}
        />
      </View>
      <View style={styles.textBlock}>
        {text1 ? (
          <Text style={styles.title} numberOfLines={2}>
            {text1}
          </Text>
        ) : null}
        {text2 ? (
          <Text style={styles.subtitle} numberOfLines={4}>
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.wrap}>
      <View style={styles.cardShadow}>
        <Pressable
          accessibilityRole="alert"
          onPress={onPress}
          style={({ pressed }) => [
            styles.pressable,
            pressed && styles.pressablePressed,
          ]}
        >
          {Platform.OS === 'web' ? (
            <View style={styles.blur}>{inner}</View>
          ) : (
            <BlurView intensity={intensity} tint={tint} style={styles.blur}>
              {inner}
            </BlurView>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export const toastConfig: ToastConfig = {
  success: (props) => <IosToastBanner {...props} variant="success" />,
  error: (props) => <IosToastBanner {...props} variant="error" />,
  info: (props) => <IosToastBanner {...props} variant="info" />,
};

const styles = StyleSheet.create((theme) => ({
  wrap: {
    paddingHorizontal: theme.spacing[4],
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  cardShadow: {
    width: '100%',
    borderRadius: 14,
    ...Platform.select({
      android: {
        elevation: 8,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
      },
      web: {
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.18)',
      },
    }),
  },
  pressable: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  pressablePressed: {
    opacity: 0.92,
  },
  blur: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
  },
  iconWrap: {
    paddingLeft: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    paddingVertical: theme.spacing[3],
    paddingRight: theme.spacing[4],
    paddingLeft: theme.spacing[3],
    justifyContent: 'center',
    gap: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: -0.24,
    lineHeight: 20,
    color: theme.colors.muted,
  },
}));
