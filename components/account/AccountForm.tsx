import { AvatarInput } from 'components/ui/AvatarInput';
import { Formik } from 'formik';
import {
  ACCOUNT_AVATAR_EMOJIS,
  DEFAULT_ACCOUNT_AVATAR_EMOJI,
} from 'lib/accountAvatarEmojis';
import React, { useMemo } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useI18n } from 'hooks/i18n/I18nProvider';
import { avatarTintFromName } from 'utils/avatarTintFromName';
import { createAccountFormSchema } from 'validation/accountFormSchema';

import type { Account } from './AccountItem';

export type AccountFormProps = {
  data: Account;
  onSubmit: (values: Account) => void;
  /** When true, name field label and input text are horizontally centered. */
  centeredText?: boolean;
};

export function AccountForm({
  data,
  onSubmit,
  centeredText = false,
}: AccountFormProps) {
  const { theme } = useUnistyles();
  const { t } = useI18n();
  const validationSchema = useMemo(() => createAccountFormSchema(t), [t]);
  const emojiChoices = useMemo(() => {
    const icon = data.avatarIcon;
    const base = [...ACCOUNT_AVATAR_EMOJIS];
    const preset = ACCOUNT_AVATAR_EMOJIS as readonly string[];
    if (icon && !preset.includes(icon)) {
      return [icon, ...base];
    }
    return base;
  }, [data.avatarIcon]);

  return (
    <Formik<Account>
      initialValues={data}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({
        values,
        handleSubmit,
        handleBlur,
        errors,
        touched,
        isSubmitting,
        setFieldValue,
        submitCount,
      }) => {
        const showNameError = Boolean(errors.name && (touched.name || submitCount > 0));
        const otherFieldErrors = Object.entries(errors).filter(
          ([key, msg]) => key !== 'name' && msg != null && String(msg).length > 0,
        );

        const fieldTextAlign = centeredText ? 'center' : 'left';

        return (
          <View style={styles.avoid}>
            <ScrollView
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.column}>
                <View style={styles.avatarBlock}>
                  <AvatarInput
                    emojis={emojiChoices}
                    value={values.avatarIcon ?? DEFAULT_ACCOUNT_AVATAR_EMOJI}
                    onChange={(emoji) => setFieldValue('avatarIcon', emoji)}
                    circleBackgroundColor={
                      values.avatarBackground ?? theme.colors.avatarFallback
                    }
                    emojiColor={values.avatarColor}
                  />
                  <Text style={styles.avatarHint}>{t('accountForm.avatarHint')}</Text>
                </View>

                <View style={styles.fieldBlock}>
                  <Text style={[styles.label, { textAlign: fieldTextAlign }]}>
                    {t('accountForm.nameLabel')}
                  </Text>
                  <TextInput
                    value={values.name}
                    onChangeText={(text) => {
                      setFieldValue('name', text);
                      const tint = avatarTintFromName(text);
                      if (tint) {
                        setFieldValue('avatarBackground', tint.avatarBackground);
                        setFieldValue('avatarColor', tint.avatarColor);
                      } else {
                        setFieldValue('avatarBackground', undefined);
                        setFieldValue('avatarColor', undefined);
                      }
                    }}
                    onBlur={handleBlur('name')}
                    placeholder={t('accountForm.namePlaceholder')}
                    placeholderTextColor={theme.colors.muted}
                    autoCapitalize="words"
                    autoCorrect
                    style={[
                      styles.input,
                      showNameError && styles.inputInvalid,
                      { textAlign: fieldTextAlign },
                    ]}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                      requestAnimationFrame(() => handleSubmit());
                    }}
                  />
                  {showNameError ? (
                    <Text
                      style={styles.error}
                      accessibilityLiveRegion="polite"
                      accessibilityRole="alert"
                    >
                      {errors.name}
                    </Text>
                  ) : null}
                  {submitCount > 0 && otherFieldErrors.length > 0 ? (
                    <View style={styles.otherErrors}>
                      {otherFieldErrors.map(([key, msg]) => (
                        <Text key={key} style={styles.error}>
                          {String(msg)}
                        </Text>
                      ))}
                    </View>
                  ) : null}
                </View>
              </View>
            </ScrollView>

            <View style={styles.submitBar}>
              <Pressable
                accessibilityRole="button"
                disabled={isSubmitting}
                onPress={() => {
                  Keyboard.dismiss();
                  requestAnimationFrame(() => handleSubmit());
                }}
                style={({ pressed }) => [
                  styles.submit,
                  pressed && styles.submitPressed,
                  isSubmitting && styles.submitDisabled,
                ]}
              >
                <Text style={styles.submitLabel}>{t('accountForm.save')}</Text>
              </Pressable>
            </View>
          </View>
        );
      }}
    </Formik>
  );
}

const styles = StyleSheet.create((theme) => ({
  avoid: {
    width: '100%',
    flexShrink: 1,
    minHeight: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing[2],
  },
  column: {
    width: '100%',
    alignItems: 'stretch',
    gap: theme.spacing[5],
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[2],
  },
  avatarBlock: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  avatarHint: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  fieldBlock: {
    gap: theme.spacing[2],
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.card,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    fontSize: 17,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
  inputInvalid: {
    borderColor: theme.colors.error,
    borderWidth: 1,
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
  },
  otherErrors: {
    gap: theme.spacing[1],
  },
  submitBar: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[2],
    paddingBottom: theme.spacing[2],
  },
  submit: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[4],
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.primary,
  },
  submitPressed: {
    opacity: 0.85,
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
}));
