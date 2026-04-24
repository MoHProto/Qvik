import Ionicons from '@expo/vector-icons/Ionicons';
import { OverlaySheetModal } from 'components/ui/OverlaySheetModal';
import { EmptyMessage } from 'components/ui/EmptyMessage';
import React from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
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
      header="Menu"
    >
      {({ finish }) => (
        <>
          <View style={styles.listWrap}>
            {data.length === 0 ? (
              <View style={styles.emptyWrap}>
                <EmptyMessage icon="menu-outline" message="No menu items" />
              </View>
            ) : (
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.listContent}
                bounces={false}
                showsVerticalScrollIndicator
              >
                {data.map((item, index) => (
                  <React.Fragment key={`${item.label}:${item.url}:${index}`}>
                    {index > 0 ? <View style={styles.separator} /> : null}
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
                  </React.Fragment>
                ))}
              </ScrollView>
            )}
          </View>
        </>
      )}
    </OverlaySheetModal>
  );
}

const styles = StyleSheet.create((theme) => ({
  listWrap: {
    maxHeight: maxSheetHeight - 88,
    minHeight: 120,
  },
  emptyWrap: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
  scroll: {
    maxHeight: maxSheetHeight - 88,
  },
  listContent: {
    paddingBottom: theme.spacing[4],
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
    marginLeft: theme.spacing[4],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    minHeight: 56,
  },
  rowPressed: {
    opacity: 0.65,
  },
  rowLabel: {
    flex: 1,
    minWidth: 0,
    fontSize: 17,
    fontWeight: '400',
    color: theme.colors.text,
  },
}));

