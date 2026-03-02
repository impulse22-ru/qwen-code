/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import type { CommandItem } from '../types/index.js';

const DEFAULT_COMMANDS: CommandItem[] = [
  { label: '/mode architect', value: 'mode architect', description: 'Switch to Architect mode' },
  { label: '/mode code', value: 'mode code', description: 'Switch to Code mode' },
  { label: '/mode ask', value: 'mode ask', description: 'Switch to Ask mode' },
  { label: '/mode debug', value: 'mode debug', description: 'Switch to Debug mode' },
  { label: '/mode review', value: 'mode review', description: 'Switch to Review mode' },
  { label: '/enhance', value: 'enhance', description: 'Enhance current prompt' },
  { label: '/help', value: 'help', description: 'Show help' },
];

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands?: CommandItem[];
  onCommandExecute?: (command: CommandItem) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands = DEFAULT_COMMANDS,
  onCommandExecute,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (!isOpen) return;

    if (key.escape) {
      onClose();
      return;
    }

    if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    }

    if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(filteredCommands.length - 1, prev + 1));
    }

    if (key.return && filteredCommands[selectedIndex]) {
      onCommandExecute?.(filteredCommands[selectedIndex]);
      onClose();
    }
  });

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <Box
      flexDirection="column"
      position="absolute"
      top={5}
      left={10}
      width={60}
      backgroundColor="#252526"
      border="single"
      borderColor="#007acc"
    >
      <Box padding={1}>
        <Text color="gray">Command Palette (Esc to close)</Text>
      </Box>
      <Box padding={1}>
        <TextInput
          value={inputValue}
          onChange={setInputValue}
          placeholder="Type a command..."
          focus={true}
        />
      </Box>
      <Box flexDirection="column" maxHeight={10}>
        {filteredCommands.length === 0 ? (
          <Box padding={1}>
            <Text color="gray">No commands found</Text>
          </Box>
        ) : (
          filteredCommands.map((cmd, index) => (
            <Box
              key={cmd.value}
              padding={1}
              backgroundColor={index === selectedIndex ? '#007acc' : 'transparent'}
            >
              <Text color={index === selectedIndex ? 'white' : 'white'}>
                {cmd.label}
              </Text>
              <Text color="gray"> - {cmd.description}</Text>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};
