/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Box, Text } from 'ink';
import { highlightCode, getTokenColor, detectLanguage } from '../utils/syntax-highlight.js';
import { useTheme } from '../hooks/useTheme.js';
import type { EditorCursor } from '../types/index.js';

export interface EditorProps {
  content: string;
  fileName?: string;
  cursorPosition?: EditorCursor;
  showLineNumbers?: boolean;
}

export const Editor: React.FC<EditorProps> = ({
  content,
  fileName = 'untitled.ts',
  cursorPosition = { line: 1, column: 1 },
  showLineNumbers = true,
}) => {
  const { currentTheme } = useTheme();
  const lines = content.split('\n');
  const language = detectLanguage(fileName);

  const highlightLine = (line: string) => {
    const tokens = highlightCode(line, language);
    return tokens.map((token, i) => (
      <Text key={i} color={getTokenColor(token.type, currentTheme)}>
        {token.content}
      </Text>
    ));
  };

  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      backgroundColor={currentTheme.colors.editor}
    >
      {lines.map((line, index) => (
        <Box key={index}>
          {showLineNumbers && (
            <Text
              color={currentTheme.colors.lineNumbers}
              width={5}
              textAlign="right"
            >
              {index + 1}
            </Text>
          )}
          <Text> </Text>
          {highlightLine(line)}
          {index === cursorPosition.line - 1 && (
            <Text backgroundColor={currentTheme.colors.selection}> </Text>
          )}
        </Box>
      ))}
    </Box>
  );
};
