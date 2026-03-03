/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useTheme } from '../hooks/useTheme.js';

export interface TerminalProps {
  cwd?: string;
  onClose?: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({
  cwd = process.cwd(),
  onClose,
}) => {
  const { currentTheme } = useTheme();
  const [history, setHistory] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(true);
  const outputRef = useRef<HTMLDivElement>(null);

  useInput((input, key) => {
    if (key.escape && onClose) {
      onClose();
      return;
    }

    if (key.return && inputValue.trim()) {
      const command = inputValue.trim();
      setHistory((prev) => [...prev, `$ ${command}`]);

      // Execute command (simplified - in real implementation would use node-pty)
      try {
        const { execSync } = require('child_process');
        const output = execSync(command, {
          cwd,
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'],
        });
        setHistory((prev) => [...prev, output]);
      } catch (error: any) {
        setHistory((prev) => [
          ...prev,
          `Error: ${error.message || 'Command failed'}`,
        ]);
      }

      setInputValue('');
    }

    if (key.ctrl && input === 'c') {
      setInputValue('');
    }
  });

  return (
    <Box
      flexDirection="column"
      backgroundColor="#1e1e1e"
      flexGrow={1}
      border="single"
      borderColor={currentTheme.colors.statusBar}
    >
      {/* Terminal Header */}
      <Box
        flexDirection="row"
        justifyContent="space-between"
        padding={1}
        backgroundColor={currentTheme.colors.statusBar}
      >
        <Text bold color="white">
          💻 Terminal
        </Text>
        <Text color="white" onClick={onClose}>
          × Close (Esc)
        </Text>
      </Box>

      {/* Terminal Output */}
      <Box flexDirection="column" flexGrow={1} padding={1}>
        <Box flexDirection="column" flexGrow={1}>
          {history.map((line, index) => (
            <Box key={index}>
              <Text
                color={line.startsWith('$') ? '#569cd6' : '#d4d4d4'}
              >
                {line}
              </Text>
            </Box>
          ))}
        </Box>

        {/* Terminal Input */}
        <Box flexDirection="row" padding={1}>
          <Text color="#569cd6">$ </Text>
          <TextInput
            value={inputValue}
            onChange={setInputValue}
            placeholder="Type command..."
            focus={isFocused}
          />
        </Box>
      </Box>

      {/* Terminal Footer */}
      <Box
        padding={1}
        backgroundColor={currentTheme.colors.tabs}
        flexDirection="row"
        justifyContent="space-between"
      >
        <Text color="gray">
          cwd: {cwd}
        </Text>
        <Text color="gray">
          Esc: Close | Enter: Execute | Ctrl+C: Cancel
        </Text>
      </Box>
    </Box>
  );
};
