/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { useTheme, type ThemeName } from '../hooks/useTheme.js';
import type { ModeDefinition } from '@qwen-code/modes';

export interface Settings {
  theme: ThemeName;
  mode: string;
  autoSave: boolean;
  lineNumbers: boolean;
  wordWrap: boolean;
  tabSize: number;
}

export interface SettingsPanelProps {
  modes: ModeDefinition[];
  currentMode?: ModeDefinition;
  onModeChange?: (modeId: string) => void;
  onClose?: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  modes,
  currentMode,
  onModeChange,
  onClose,
}) => {
  const { themeName, toggleTheme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('appearance');
  const [autoSave, setAutoSave] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);
  const [tabSize, setTabSize] = useState(2);

  useInput((input, key) => {
    if (key.escape && onClose) {
      onClose();
    }

    if (key.tab) {
      const sections = ['appearance', 'editor', 'modes'];
      const currentIndex = sections.indexOf(activeSection);
      const nextIndex = (currentIndex + 1) % sections.length;
      setActiveSection(sections[nextIndex]);
    }
  });

  const themeOptions = [
    { label: '🌙 Dark', value: 'dark' },
    { label: '☀️ Light', value: 'light' },
  ];

  const modeOptions = modes.map((m) => ({
    label: `${m.icon} ${m.name}`,
    value: m.id,
  }));

  const renderAppearance = () => (
    <Box flexDirection="column">
      <Box padding={1}>
        <Text bold>Theme</Text>
      </Box>
      <Box paddingLeft={2}>
        <SelectInput
          items={themeOptions}
          initialIndex={themeName === 'dark' ? 0 : 1}
          onSelect={(item) => setTheme(item.value as ThemeName)}
        />
      </Box>
    </Box>
  );

  const renderEditor = () => (
    <Box flexDirection="column">
      <Box padding={1}>
        <Text bold>Editor Settings</Text>
      </Box>
      <Box paddingLeft={2} flexDirection="column">
        <Box padding={1}>
          <Text color={lineNumbers ? 'green' : 'gray'}>
            {lineNumbers ? '✓' : '○'} Line Numbers
          </Text>
        </Box>
        <Box padding={1}>
          <Text color={wordWrap ? 'green' : 'gray'}>
            {wordWrap ? '✓' : '○'} Word Wrap
          </Text>
        </Box>
        <Box padding={1}>
          <Text color={autoSave ? 'green' : 'gray'}>
            {autoSave ? '✓' : '○'} Auto Save
          </Text>
        </Box>
        <Box padding={1}>
          <Text>Tab Size: {tabSize}</Text>
        </Box>
      </Box>
    </Box>
  );

  const renderModes = () => (
    <Box flexDirection="column">
      <Box padding={1}>
        <Text bold>Current Mode</Text>
      </Box>
      <Box paddingLeft={2}>
        <SelectInput
          items={modeOptions}
          initialIndex={modes.findIndex((m) => m.id === currentMode?.id)}
          onSelect={(item) => onModeChange?.(item.value)}
        />
      </Box>
    </Box>
  );

  return (
    <Box
      flexDirection="column"
      border="single"
      borderColor="gray"
      padding={1}
    >
      {/* Header */}
      <Box padding={1}>
        <Text bold>⚙️ Settings</Text>
        <Text color="gray"> (Tab: Switch Section, Esc: Close)</Text>
      </Box>

      {/* Sections Tabs */}
      <Box flexDirection="row" borderBottom="single" borderColor="gray" padding={1}>
        <Text
          color={activeSection === 'appearance' ? 'blue' : 'gray'}
          bold={activeSection === 'appearance'}
        >
          Appearance{' '}
        </Text>
        <Text color="gray">| </Text>
        <Text
          color={activeSection === 'editor' ? 'blue' : 'gray'}
          bold={activeSection === 'editor'}
        >
          Editor{' '}
        </Text>
        <Text color="gray">| </Text>
        <Text
          color={activeSection === 'modes' ? 'blue' : 'gray'}
          bold={activeSection === 'modes'}
        >
          Modes
        </Text>
      </Box>

      {/* Content */}
      <Box padding={1} minHeight={10}>
        {activeSection === 'appearance' && renderAppearance()}
        {activeSection === 'editor' && renderEditor()}
        {activeSection === 'modes' && renderModes()}
      </Box>

      {/* Footer */}
      <Box
        flexDirection="row"
        justifyContent="space-between"
        paddingTop={1}
        borderTop="single"
        borderColor="gray"
      >
        <Text color="gray">Tab: Switch Section</Text>
        <Text color="gray">Esc: Close</Text>
      </Box>
    </Box>
  );
};
