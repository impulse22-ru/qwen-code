/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import type { Theme } from '../types/index.js';

export interface Token {
  type: string;
  content: string;
}

/**
 * Highlight code using Prism.js
 */
export const highlightCode = (
  code: string,
  language: string = 'typescript'
): Token[] => {
  const grammar = Prism.languages[language] || Prism.languages.typescript;
  const tokens = Prism.tokenize(code, grammar);

  return tokens.map((token: unknown) => {
    if (typeof token === 'string') {
      return { type: 'plain', content: token };
    }
    const prismToken = token as { type: string; content: string };
    return {
      type: prismToken.type,
      content: prismToken.content.toString(),
    };
  });
};

/**
 * Get color for syntax token type
 */
export const getTokenColor = (type: string, theme: Theme): string => {
  const colorMap: Record<string, string> = {
    keyword: theme.syntax.keyword,
    string: theme.syntax.string,
    function: theme.syntax.function,
    comment: theme.syntax.comment,
    number: theme.syntax.number,
    operator: theme.syntax.operator,
    class: theme.syntax.type,
    'class-name': theme.syntax.type,
    type: theme.syntax.type,
    plain: theme.colors.foreground,
  };
  return colorMap[type] || colorMap.plain;
};

/**
 * Detect language from file extension
 */
export const detectLanguage = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'tsx',
    js: 'javascript',
    jsx: 'javascript',
    json: 'json',
    md: 'markdown',
    mds: 'markdown',
    html: 'html',
    css: 'css',
    scss: 'scss',
    py: 'python',
    go: 'go',
    rs: 'rust',
    rb: 'ruby',
    sh: 'bash',
    bash: 'bash',
    zsh: 'bash',
  };

  return languageMap[ext || ''] || 'typescript';
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};
