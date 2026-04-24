import Ionicons from '@expo/vector-icons/Ionicons';
import { OverlaySheetModal } from 'components/ui/OverlaySheetModal';
import { EmptyMessage } from 'components/ui/EmptyMessage';
import React from 'react';
import { Dimensions, FlatList, Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { PopupProps } from 'react-popup-manager';

const maxSheetHeight = Math.round(Dimensions.get('window').height * 0.72);

export type MenuItem = { label: string; url: string };

export type MenuModalData = MenuItem[];

export type MenuModalResult = undefined | null | MenuItem;

export type MenuModalOwnProps = {
  data: MenuModalData;
  onPress?: (item: MenuItem) => void;
};

export type MenuModalProps = MenuModalOwnProps & PopupProps;

export function MenuModal({ isOpen: _isOpen, onClose, data, onPress }: MenuModalProps) {
  const { theme } = useUnistyles();

  return (
    <OverlaySheetModal<MenuModalResult>
      maxSheetHeight={maxSheetHeight}
      onClose={onClose}
      sheetSize="intrinsic"
    >
      {({ finish }) => (
        <>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle} numberOfLines={1}>
              Menu
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={12}
              onPress={() => finish(null)}
              style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
            >
              <Ionicons name="close" size={18} color={theme.colors.text} />
            </Pressable>
          </View>

          <View style={styles.listWrap}>
            <FlatList
              data={data}
              keyExtractor={(item, index) => `${item.label}:${item.url}:${index}`}
              contentContainerStyle={data.length === 0 ? styles.listEmptyContent : styles.listContent}
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  onPress={() => {
                    onPress?.(item);
                    finish(item);
                  }}
                  style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                >
                  <Text style={styles.rowLabel} numberOfLines={1}>
                    {item.label}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
                </Pressable>
              )}
              ListEmptyComponent={
                <EmptyMessage icon="menu-outline" message="No menu items" />
              }
            />
          </View>
        </>
      )}
    </OverlaySheetModal>
  );
}

const styles = StyleSheet.create((theme) => ({
  sheetHeader: {
    zIndex: 2,
    elevation: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    paddingBottom: theme.spacing[3],
    backgroundColor: theme.colors.surface,
  },
  sheetTitle: {
    flex: 1,
    minWidth: 0,
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'left',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.incomingBubble,
  },
  closeButtonPressed: {
    opacity: 0.65,
  },
  listWrap: {
    maxHeight: maxSheetHeight - 88,
    minHeight: 120,
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[2],
  },
  listContent: {
    paddingBottom: theme.spacing[2],
  },
  listEmptyContent: {
    paddingVertical: theme.spacing[2],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[3],
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing[2],
  },
  rowPressed: {
    opacity: 0.65,
  },
  rowLabel: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
}));

