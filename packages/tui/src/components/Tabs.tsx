/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../hooks/useTheme.js';
import type { Tab } from '../types/index.js';

export interface TabsProps {
  tabs: Tab[];
  activeTabId: string;
  onTabClose: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTabId,
  onTabClose,
}) => {
  const { currentTheme } = useTheme();

  return (
    <Box
      flexDirection="row"
      backgroundColor={currentTheme.colors.tabs}
    >
      {tabs.map((tab) => (
        <Box
          key={tab.id}
          flexDirection="row"
          padding={1}
          backgroundColor={tab.id === activeTabId ? currentTheme.colors.activeTab : currentTheme.colors.tabs}
          borderRight="single"
          borderColor={currentTheme.colors.border}
        >
          <Text
            color={tab.id === activeTabId ? currentTheme.colors.foreground : '#969696'}
          >
            {tab.name}
          </Text>
          {tab.isModified && (
            <Text color={currentTheme.colors.foreground}> ●</Text>
          )}
          <Text
            color="#969696"
            onClick={() => onTabClose(tab.id)}
          >
            {' '}×
          </Text>
        </Box>
      ))}
    </Box>
  );
};
