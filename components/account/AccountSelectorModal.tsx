import type { PopupProps } from 'react-popup-manager';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { AccountList } from './AccountList';
import type { AccountItemData } from './AccountItem';

const SHEET_ANIM_MS = 240;
const maxSheetHeight = Math.round(Dimensions.get('window').height * 0.78);

export type AccountSelectorModalOwnProps = {
  accounts: AccountItemData[];
  activeAccountId: string;
  onSelectAccount?: (id: string) => void;
  onAddAccount?: () => void;
};

export type AccountSelectorModalProps = AccountSelectorModalOwnProps &
  PopupProps;

export function AccountSelectorModal({
  isOpen: _isOpen,
  onClose,
  accounts,
  activeAccountId,
  onSelectAccount,
  onAddAccount,
}: AccountSelectorModalProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(maxSheetHeight)).current;
  const [modalShown, setModalShown] = useState(true);
  const closingRef = useRef(false);

  const runClose = useCallback(
    (...args: unknown[]) => {
      if (closingRef.current) return;
      closingRef.current = true;
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: SHEET_ANIM_MS,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: maxSheetHeight,
          duration: SHEET_ANIM_MS,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalShown(false);
        onClose?.(...args);
      });
    },
    [backdropOpacity, onClose, sheetTranslateY],
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: SHEET_ANIM_MS,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: SHEET_ANIM_MS,
        useNativeDriver: true,
      }),
    ]).start();
  }, [backdropOpacity, sheetTranslateY]);

  const handleSelect = (item: AccountItemData) => {
    onSelectAccount?.(item.id);
    runClose();
  };

  return (
    <Modal
      transparent
      visible={modalShown}
      animationType="none"
      onRequestClose={() => runClose()}
    >
      <View style={styles.root} pointerEvents="box-none">
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          onPress={() => runClose()}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.backdrop,
              { opacity: backdropOpacity },
            ]}
          />
        </Pressable>

        <Animated.View
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom, theme.spacing[4]),
              maxHeight: maxSheetHeight,
              transform: [{ translateY: sheetTranslateY }],
            },
          ]}
        >
          <View style={styles.grabberWrap}>
            <View style={styles.grabber} />
          </View>
          <Text style={styles.sheetTitle}>Accounts</Text>
          <View style={styles.listWrap}>
            <AccountList
              data={accounts}
              activeAccountId={activeAccountId}
              onItemPress={handleSelect}
              emptyMessage={{
                icon: 'person-outline',
                message: 'No accounts yet.',
              }}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              onAddAccount?.();
              runClose();
            }}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
            ]}
          >
            <Ionicons
              name="add-circle-outline"
              size={22}
              color={theme.colors.primary}
            />
            <Text style={styles.addLabel}>Add new account</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.card,
    borderTopRightRadius: theme.radius.card,
    paddingTop: theme.spacing[2],
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: theme.colors.border,
  },
  grabberWrap: {
    alignItems: 'center',
    paddingBottom: theme.spacing[2],
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
  },
  sheetTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.muted,
    textAlign: 'center',
    marginBottom: theme.spacing[2],
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  listWrap: {
    maxHeight: maxSheetHeight - 160,
    minHeight: 120,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    paddingVertical: theme.spacing[4],
    marginHorizontal: theme.spacing[4],
    marginTop: theme.spacing[1],
  },
  addButtonPressed: {
    opacity: 0.55,
  },
  addLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.primary,
  },
}));
