import React from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';

export default function WebTabsLayout() {
  return (
    <Tabs>
      <TabSlot />

      <TabList style={styles.tabList}>
        <TabTrigger name="index" href="/" style={styles.tab}>
          <Text style={styles.tabLabel}>Home</Text>
        </TabTrigger>
        <TabTrigger name="explore" href="/explore" style={styles.tab}>
          <Text style={styles.tabLabel}>Explore</Text>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create((theme) => ({
  tabList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing[3],
    paddingBottom: theme.spacing[5],
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  tab: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.radius.pill,
  },
  tabLabel: {
    ...theme.typography.tabLabel,
    color: theme.colors.text,
  },
}));
