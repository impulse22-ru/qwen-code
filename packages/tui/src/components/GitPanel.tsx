/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../hooks/useTheme.js';

export interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  modified: string[];
  added: string[];
  deleted: string[];
  untracked: string[];
}

export interface GitPanelProps {
  status?: GitStatus;
  onFileSelect?: (filePath: string) => void;
}

export const GitPanel: React.FC<GitPanelProps> = ({
  status,
  onFileSelect,
}) => {
  const { currentTheme } = useTheme();

  if (!status) {
    return (
      <Box padding={1}>
        <Text color="gray">No Git repository</Text>
      </Box>
    );
  }

  const { branch, ahead, behind, modified, added, deleted, untracked } = status;

  return (
    <Box flexDirection="column" flexGrow={1}>
      {/* Branch Info */}
      <Box padding={1} borderBottom="single" borderColor="gray">
        <Text bold color="green">
          🌿 {branch}
        </Text>
        {(ahead > 0 || behind > 0) && (
          <Text color="gray">
            {' '}({ahead > 0 && `↑${ahead}`} {ahead > 0 && behind > 0 && ' '}{behind > 0 && `↓${behind}`})
          </Text>
        )}
      </Box>

      {/* Changes */}
      <Box flexDirection="column">
        {/* Modified Files */}
        {modified.length > 0 && (
          <>
            <Box padding={1}>
              <Text bold color="yellow">Modified ({modified.length})</Text>
            </Box>
            {modified.map((file) => (
              <Box key={file} paddingLeft={2}>
                <Text color="yellow" onClick={() => onFileSelect?.(file)}>
                  ✏️ {file}
                </Text>
              </Box>
            ))}
          </>
        )}

        {/* Added Files */}
        {added.length > 0 && (
          <>
            <Box padding={1}>
              <Text bold color="green">Added ({added.length})</Text>
            </Box>
            {added.map((file) => (
              <Box key={file} paddingLeft={2}>
                <Text color="green" onClick={() => onFileSelect?.(file)}>
                  ➕ {file}
                </Text>
              </Box>
            ))}
          </>
        )}

        {/* Deleted Files */}
        {deleted.length > 0 && (
          <>
            <Box padding={1}>
              <Text bold color="red">Deleted ({deleted.length})</Text>
            </Box>
            {deleted.map((file) => (
              <Box key={file} paddingLeft={2}>
                <Text color="red" onClick={() => onFileSelect?.(file)}>
                  ❌ {file}
                </Text>
              </Box>
            ))}
          </>
        )}

        {/* Untracked Files */}
        {untracked.length > 0 && (
          <>
            <Box padding={1}>
              <Text bold color="gray">Untracked ({untracked.length})</Text>
            </Box>
            {untracked.map((file) => (
              <Box key={file} paddingLeft={2}>
                <Text color="gray" onClick={() => onFileSelect?.(file)}>
                  ❓ {file}
                </Text>
              </Box>
            ))}
          </>
        )}

        {/* No Changes */}
        {modified.length === 0 &&
          added.length === 0 &&
          deleted.length === 0 &&
          untracked.length === 0 && (
            <Box padding={1}>
              <Text color="green">✓ No changes</Text>
            </Box>
          )}
      </Box>
    </Box>
  );
};
