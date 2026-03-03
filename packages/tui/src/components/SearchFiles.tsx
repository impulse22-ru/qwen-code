/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import type { FileTreeItem } from '../types/index.js';
import { useTheme } from '../hooks/useTheme.js';

export interface SearchFilesProps {
  files: FileTreeItem[];
  onFileSelect: (filePath: string) => void;
}

export const SearchFiles: React.FC<SearchFilesProps> = ({
  files,
  onFileSelect,
}) => {
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Flatten file tree for searching
  const allFiles = useMemo(() => {
    const flat: FileTreeItem[] = [];
    
    const traverse = (items: FileTreeItem[]) => {
      for (const item of items) {
        if (item.type === 'file') {
          flat.push(item);
        }
        if (item.children) {
          traverse(item.children);
        }
      }
    };
    
    traverse(files);
    return flat;
  }, [files]);

  // Filter files by search query
  const filteredFiles = useMemo(() => {
    if (!searchQuery) return allFiles.slice(0, 20);
    return allFiles
      .filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 20);
  }, [searchQuery, allFiles]);

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    }

    if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(filteredFiles.length - 1, prev + 1));
    }

    if (key.return && filteredFiles[selectedIndex]) {
      onFileSelect(filteredFiles[selectedIndex].path);
    }
  });

  return (
    <Box flexDirection="column" flexGrow={1}>
      <Box padding={1}>
        <Text color="gray">Search files (type to search):</Text>
      </Box>
      <Box padding={1}>
        <TextInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Type filename..."
          focus={true}
        />
      </Box>
      <Box flexDirection="column">
        {filteredFiles.length === 0 ? (
          <Box padding={1}>
            <Text color="gray">No files found</Text>
          </Box>
        ) : (
          filteredFiles.map((file, index) => (
            <Box
              key={file.path}
              padding={1}
              backgroundColor={index === selectedIndex ? currentTheme.colors.selection : 'transparent'}
            >
              <Text color={currentTheme.colors.foreground}>
                📄 {file.path}
              </Text>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};
