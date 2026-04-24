import { OverlaySheetModal } from 'components/ui/OverlaySheetModal';
import React, { useMemo } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import type { PopupProps } from 'react-popup-manager';

const maxSheetHeight = Math.round(Dimensions.get('window').height * 0.42);

export type ConfirmModalData = {
  title: string;
  description?: string;
  noLabel?: string;
  yesLabel?: string;
};

/**
 * - `undefined`: dismissed (backdrop tap, close button, Android back).
 * - `false`: explicit "No".
 * - `true`: explicit "Yes".
 */
export type ConfirmModalResult = undefined | boolean;

export type ConfirmModalProps = {
  data: ConfirmModalData;
} & PopupProps;

export function ConfirmModal({ isOpen: _isOpen, onClose, data }: ConfirmModalProps) {
  const noLabel = data.noLabel ?? 'No';
  const yesLabel = data.yesLabel ?? 'Yes';

  const header = useMemo(
    () => ({
      title: data.title,
      closeValue: undefined as ConfirmModalResult,
      closeLabel: 'Close',
    }),
    [data.title],
  );

  return (
    <OverlaySheetModal<ConfirmModalResult>
      maxSheetHeight={maxSheetHeight}
      onClose={onClose}
      sheetSize="intrinsic"
      header={header}
      backdropDismissValue={undefined}
      hardwareBackValue={undefined}
    >
      {({ finish }) => (
        <View style={styles.body}>
          {data.description ? <Text style={styles.description}>{data.description}</Text> : null}
          <View style={styles.buttonsRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={noLabel}
              onPress={() => finish(false)}
              style={({ pressed }) => [styles.noButton, pressed && styles.noButtonPressed]}
            >
              <Text style={styles.noButtonLabel} numberOfLines={1}>
                {noLabel}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={yesLabel}
              onPress={() => finish(true)}
              style={({ pressed }) => [styles.yesButton, pressed && styles.yesButtonPressed]}
            >
              <Text style={styles.yesButtonLabel} numberOfLines={1}>
                {yesLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </OverlaySheetModal>
  );
}

const styles = StyleSheet.create((theme) => ({
  body: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[4],
    paddingTop: theme.spacing[2],
    gap: theme.spacing[4],
  },
  description: {
    fontSize: 15,
    fontWeight: '400',
    color: theme.colors.text,
    lineHeight: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: theme.spacing[2],
  },
  noButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[4],
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.incomingBubble,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  noButtonPressed: {
    opacity: 0.8,
  },
  noButtonLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text,
  },
  yesButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[4],
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.primary,
  },
  yesButtonPressed: {
    opacity: 0.85,
  },
  yesButtonLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
}));

