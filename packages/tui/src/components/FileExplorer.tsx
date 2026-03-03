/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { FileTreeItem } from '../types/index.js';
import { useTheme } from '../hooks/useTheme.js';

export interface FileExplorerProps {
  files: FileTreeItem[];
  onFileSelect: (filePath: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  onFileSelect,
}) => {
  const { currentTheme } = useTheme();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['.']));

  useInput((input, key) => {
    if (key.upArrow) {
      setFocusedIndex((prev) => Math.max(0, prev - 1));
    }

    if (key.downArrow) {
      setFocusedIndex((prev) => prev + 1);
    }

    if (key.return) {
      // Handle file/folder selection (would need flat list for proper implementation)
    }
  });

  const toggleDirectory = (path: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderFileTree = (items: FileTreeItem[], depth: number = 0, parentPath: string = '') => {
    return items.flatMap((item, index) => {
      const fullPath = parentPath ? `${parentPath}/${item.name}` : item.name;
      const isDirectory = item.type === 'directory';
      const isExpanded = expandedDirs.has(fullPath);

      return [
        <Box
          key={fullPath}
          paddingLeft={depth * 2}
          backgroundColor={focusedIndex === index ? currentTheme.colors.selection : 'transparent'}
        >
          <Text
            color={isDirectory ? 'blue' : currentTheme.colors.foreground}
            onClick={() => {
              if (isDirectory) {
                toggleDirectory(fullPath);
              } else {
                onFileSelect(item.path);
              }
            }}
          >
            {isDirectory ? (isExpanded ? '📂 ' : '📁 ') : '📄 '}
            {item.name}
          </Text>
        </Box>,
        ...(isDirectory && isExpanded && item.children
          ? renderFileTree(item.children, depth + 1, fullPath)
          : []),
      ];
    });
  };

  return (
    <Box flexDirection="column" flexGrow={1}>
      {files.length === 0 ? (
        <Box padding={1}>
          <Text color="gray">No files loaded</Text>
        </Box>
      ) : (
        renderFileTree(files)
      )}
    </Box>
  );
};
