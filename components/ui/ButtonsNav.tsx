import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export type ButtonsNavItemData = {
  name: string;
  icon: ComponentProps<typeof Ionicons>['name'];
};

export type ButtonsNavProps = {
  data: ButtonsNavItemData[];
  onButtonPress: (button: ButtonsNavItemData) => void;
};

export function ButtonsNav({ data, onButtonPress }: ButtonsNavProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.row}>
      {data.map((item, index) => (
        <Pressable
          key={`${item.name}-${index}`}
          accessibilityRole="button"
          accessibilityLabel={item.name}
          onPress={() => onButtonPress(item)}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Ionicons name={item.icon} size={24} color={theme.colors.text} />
          <Text style={styles.label} numberOfLines={1}>
            {item.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: theme.spacing[2],
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[2],
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.surface,
  },
  buttonPressed: {
    opacity: 0.65,
  },
  label: {
    marginTop: theme.spacing[2],
    fontSize: 13,
    fontWeight: '400',
    color: theme.colors.text,
    textAlign: 'center',
  },
}));
