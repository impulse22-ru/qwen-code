/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import * as fs from 'fs';
import * as path from 'path';
import type { FileTreeItem } from '../types/index.js';

export const useFileSystem = (rootPath: string, maxDepth: number = 3) => {
  const [files, setFiles] = useState<FileTreeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const readDir = useCallback((dirPath: string, depth: number = 0): FileTreeItem[] => {
    if (depth > maxDepth) return [];

    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      return entries
        .filter((entry) => !entry.name.startsWith('.') && entry.name !== 'node_modules')
        .map((entry) => {
          const fullPath = path.join(dirPath, entry.name);
          return {
            name: entry.name,
            type: entry.isDirectory() ? 'directory' : 'file',
            path: fullPath,
            children: entry.isDirectory() ? readDir(fullPath, depth + 1) : undefined,
          };
        });
    } catch {
      return [];
    }
  }, [maxDepth]);

  useEffect(() => {
    const loadFiles = () => {
      try {
        const fileTree = readDir(rootPath);
        setFiles(fileTree);
        setLoading(false);
      } catch {
        setError('Failed to load files');
        setLoading(false);
      }
    };

    loadFiles();
  }, [rootPath, readDir]);

  const readFile = useCallback((filePath: string) => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      setFileContent(content);
      setSelectedFile(filePath);
      setError(null);
      return content;
    } catch {
      setError('Failed to read file');
      return '';
    }
  }, []);

  const writeFile = useCallback((filePath: string, content: string) => {
    try {
      fs.writeFileSync(filePath, content, 'utf-8');
      setFileContent(content);
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to write file';
      setError(errorMessage);
      return false;
    }
  }, []);

  const selectFile = useCallback((filePath: string) => {
    setSelectedFile(filePath);
    return readFile(filePath);
  }, [readFile]);

  return {
    files,
    loading,
    selectedFile,
    fileContent,
    error,
    readFile,
    writeFile,
    selectFile,
  };
};
