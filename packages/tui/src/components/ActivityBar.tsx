/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Box, Text } from 'ink';

export interface ActivityBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'files', icon: '📁', tooltip: 'Files' },
    { id: 'search', icon: '🔍', tooltip: 'Search' },
    { id: 'git', icon: '🌿', tooltip: 'Source Control' },
    { id: 'debug', icon: '🐛', tooltip: 'Run and Debug' },
    { id: 'modes', icon: '🎭', tooltip: 'Modes' },
    { id: 'settings', icon: '⚙️', tooltip: 'Settings' },
  ];

  return (
    <Box flexDirection="column" borderRight="single" borderColor="gray">
      {tabs.map((tab) => (
        <Box
          key={tab.id}
          padding={1}
          backgroundColor={activeTab === tab.id ? '#007acc' : 'transparent'}
        >
          <Text
            color={activeTab === tab.id ? 'white' : 'gray'}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon}
          </Text>
        </Box>
      ))}
    </Box>
  );
};
