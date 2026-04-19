import { useI18n } from 'hooks/i18n/I18nProvider';
import React from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export type SupportUkraineBannerProps = {
  title?: string;
  body?: string;
  hideBody?: boolean;
};

export function SupportUkraineBanner({ title, body, hideBody = false }: SupportUkraineBannerProps) {
  const { t } = useI18n();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => Linking.openURL('https://u24.gov.ua/')}
      style={({ pressed }) => [styles.banner, pressed && styles.bannerPressed]}
    >
      <View style={styles.bannerRow}>
        <View style={styles.bannerTextCol}>
          <View style={styles.bannerTitleRow}>
            <Text style={styles.bannerEmoji} accessibilityLabel="Ukraine flag">
              🇺🇦
            </Text>
            <Text style={styles.bannerTitle} numberOfLines={1}>
              { title ?? t('supportUkraine.banner.title')}
            </Text>
          </View>
          {!hideBody ? (
            <Text style={styles.bannerBody} numberOfLines={2}>
              {body ?? t('supportUkraine.banner.body')}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  banner: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    backgroundColor: theme.colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  bannerPressed: {
    opacity: 0.65,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  bannerEmoji: {
    fontSize: 13,
  },
  bannerTextCol: {
    flex: 1,
    minWidth: 0,
  },
  bannerTitle: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },
  bannerBody: {
    marginTop: theme.spacing[1],
    fontSize: 13,
    color: theme.colors.muted,
  },
}));
