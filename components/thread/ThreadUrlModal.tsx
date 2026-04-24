import { OverlaySheetModal } from 'components/ui/OverlaySheetModal';
import { Formik } from 'formik';
import { useI18n } from 'hooks/i18n/I18nProvider';
import React, { useMemo } from 'react';
import { Dimensions, Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { PopupProps } from 'react-popup-manager';

import { createThreadUrlSchema, type ThreadUrlFormValues } from 'validation/threadUrlSchema';

const maxSheetHeight = Math.round(Dimensions.get('window').height * 0.55);

export type ThreadUrlModalData = Record<string, never>;

export type ThreadUrlModalResult = undefined | null | { url: string };

export type ThreadUrlModalProps = {
  data?: ThreadUrlModalData;
} & PopupProps;

export function ThreadUrlModal({ isOpen: _isOpen, onClose, data: _data }: ThreadUrlModalProps) {
  const { theme } = useUnistyles();
  const { t } = useI18n();
  const validationSchema = useMemo(() => createThreadUrlSchema(t), [t]);

  const initialValues = useMemo<ThreadUrlFormValues>(
    () => ({
      url: '',
    }),
    [],
  );

  return (
    <OverlaySheetModal<ThreadUrlModalResult>
      maxSheetHeight={maxSheetHeight}
      keyboardAvoiding
      onClose={onClose}
      sheetSize="intrinsic"
      header={t('threadUrlModal.title')}
    >
      {({ finish }) => (
        <>
          <Formik<ThreadUrlFormValues>
            initialValues={initialValues}
            // validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              // setSubmitting(true);
              // try {
              //   const parsed = validationSchema.validateSync(values) as ThreadUrlFormValues;
                finish({ url: values.url });
              // } finally {
              //   setSubmitting(false);
              // }
            }}
          >
            {({
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              errors,
              touched,
              isSubmitting,
              submitCount,
            }) => {
              const showUrlError = Boolean(errors.url && (touched.url || submitCount > 0));
              return (
                <View style={styles.form}>
                  <View style={styles.fieldBlock}>
                    <Text style={styles.label}>{t('threadUrlModal.urlLabel')}</Text>
                    <TextInput
                      value={values.url}
                      onChangeText={handleChange('url')}
                      onBlur={handleBlur('url')}
                      placeholder={t('threadUrlModal.placeholder')}
                      placeholderTextColor={theme.colors.muted}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="url"
                      returnKeyType="done"
                      style={[styles.input, showUrlError && styles.inputInvalid]}
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                        requestAnimationFrame(() => handleSubmit());
                      }}
                    />
                    {showUrlError ? (
                      <Text
                        style={styles.error}
                        accessibilityLiveRegion="polite"
                        accessibilityRole="alert"
                      >
                        {errors.url}
                      </Text>
                    ) : null}
                  </View>

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
                    <Text style={styles.submitLabel}>{t('threadUrlModal.submit')}</Text>
                  </Pressable>
                </View>
              );
            }}
          </Formik>
        </>
      )}
    </OverlaySheetModal>
  );
}

const styles = StyleSheet.create((theme) => ({
  form: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[4],
    paddingTop: theme.spacing[2],
    gap: theme.spacing[4],
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
    borderColor: theme.colors.inputBorder,
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
