/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Box, Text } from 'ink';
import type { ModeDefinition } from '@qwen-code/modes';
import type { FileTreeItem } from '../types/index.js';

export interface SidebarProps {
  activeSection: 'files' | 'modes' | 'search';
  files?: FileTreeItem[];
  modes?: ModeDefinition[];
  currentMode?: ModeDefinition;
  onFileSelect: (file: string) => void;
  onModeSelect: (modeId: string) => void;
}

const FileTree: React.FC<{
  items: FileTreeItem[];
  depth: number;
  onFileSelect: (file: string) => void;
}> = ({ items, depth, onFileSelect }) => {
  return (
    <>
      {items.map((item) => (
        <Box key={item.path} paddingLeft={depth * 2}>
          <Text
            color={item.type === 'directory' ? 'blue' : 'white'}
            onClick={() => item.type === 'file' && onFileSelect(item.path)}
          >
            {item.type === 'directory' ? '📁 ' : '📄 '}
            {item.name}
          </Text>
        </Box>
      ))}
      {items.filter(i => i.type === 'directory').map(dir => (
        dir.children && (
          <FileTree
            key={dir.path}
            items={dir.children}
            depth={depth + 1}
            onFileSelect={onFileSelect}
          />
        )
      ))}
    </>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  files = [],
  modes = [],
  currentMode,
  onFileSelect,
  onModeSelect,
}) => {
  const renderFiles = () => {
    if (files.length === 0) {
      return (
        <Box padding={1}>
          <Text color="gray">No files loaded</Text>
        </Box>
      );
    }
    return <FileTree items={files} depth={0} onFileSelect={onFileSelect} />;
  };

  const renderModes = () => {
    return (
      <>
        {modes.map((mode) => (
          <Box
            key={mode.id}
            padding={1}
            backgroundColor={currentMode?.id === mode.id ? '#007acc' : 'transparent'}
          >
            <Text
              color={currentMode?.id === mode.id ? 'white' : mode.color || 'white'}
              onClick={() => onModeSelect(mode.id)}
            >
              {mode.icon} {mode.name}
            </Text>
          </Box>
        ))}
      </>
    );
  };

  return (
    <Box flexDirection="column" width={30} borderRight="single" borderColor="gray">
      <Box padding={1} borderBottom="single" borderColor="gray">
        <Text bold>
          {activeSection === 'files' && '📁 EXPLORER'}
          {activeSection === 'modes' && '🎭 MODES'}
          {activeSection === 'search' && '🔍 SEARCH'}
        </Text>
      </Box>
      
      <Box flexDirection="column" flexGrow={1}>
        {activeSection === 'files' && renderFiles()}
        {activeSection === 'modes' && renderModes()}
        {activeSection === 'search' && (
          <Box padding={1}>
            <Text color="gray">Search coming soon...</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
