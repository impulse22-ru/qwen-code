/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../hooks/useTheme.js';
import type { ModeDefinition } from '@qwen-code/modes';

export interface StatusBarProps {
  line: number;
  column: number;
  language: string;
  encoding?: string;
  currentMode?: ModeDefinition;
  gitBranch?: string;
  promptTokenCount?: number;
  enhancing?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  line,
  column,
  language,
  encoding = 'UTF-8',
  currentMode,
  gitBranch,
  promptTokenCount,
  enhancing = false,
}) => {
  const { currentTheme } = useTheme();

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      backgroundColor={currentMode?.color || currentTheme.colors.statusBar}
      padding={1}
    >
      <Box flexDirection="row">
        {currentMode && (
          <Box marginRight={2}>
            <Text bold color="white">
              {currentMode.icon} {currentMode.name}
            </Text>
          </Box>
        )}
        {gitBranch && (
          <Text color="white" marginRight={2}>
            🌿 {gitBranch}
          </Text>
        )}
        {enhancing && (
          <Text color="yellow" marginRight={2}>
            ⚡ Enhancing...
          </Text>
        )}
        <Text color="white">
          Ln {line}, Col {column}
        </Text>
      </Box>
      
      <Box flexDirection="row">
        {promptTokenCount && (
          <Text color="white" marginRight={2}>
            Score: {promptTokenCount.toFixed(1)}
          </Text>
        )}
        <Text color="white">
          {language} | {encoding}
        </Text>
      </Box>
    </Box>
  );
};
