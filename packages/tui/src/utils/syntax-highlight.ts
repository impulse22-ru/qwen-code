/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Simple syntax highlighting without Prism.js
 * Basic keyword highlighting for TypeScript/JavaScript
 */

import type { Theme } from '../types/index.js';

export interface Token {
  type: string;
  content: string;
}

// Simple keywords for basic highlighting
const KEYWORDS = [
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
  'class', 'interface', 'type', 'import', 'export', 'from', 'default',
  'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'typeof',
];

/**
 * Simple syntax highlighting for code
 */
export const highlightCode = (
  code: string,
  language: string = 'typescript'
): Token[] => {
  // Very basic tokenization
  const tokens: Token[] = [];
  let remaining = code;

  while (remaining.length > 0) {
    // Check for strings
    const stringMatch = remaining.match(/^(['"`])(?:\\.|(?!\1).)*\1/);
    if (stringMatch) {
      tokens.push({ type: 'string', content: stringMatch[0] });
      remaining = remaining.slice(stringMatch[0].length);
      continue;
    }

    // Check for comments
    const commentMatch = remaining.match(/^\/\/.*|\/\*[\s\S]*?\*\//);
    if (commentMatch) {
      tokens.push({ type: 'comment', content: commentMatch[0] });
      remaining = remaining.slice(commentMatch[0].length);
      continue;
    }

    // Check for keywords
    const keywordMatch = remaining.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
    if (keywordMatch) {
      const word = keywordMatch[0];
      const type = KEYWORDS.includes(word) ? 'keyword' : 'plain';
      tokens.push({ type, content: word });
      remaining = remaining.slice(word.length);
      continue;
    }

    // Check for numbers
    const numberMatch = remaining.match(/^\d+\.?\d*/);
    if (numberMatch) {
      tokens.push({ type: 'number', content: numberMatch[0] });
      remaining = remaining.slice(numberMatch[0].length);
      continue;
    }

    // Default: single character
    tokens.push({ type: 'plain', content: remaining[0] });
    remaining = remaining.slice(1);
  }

  return tokens;
};

/**
 * Get color for syntax token type
 */
export const getTokenColor = (type: string, theme: Theme): string => {
  const colorMap: Record<string, string> = {
    keyword: theme.syntax.keyword,
    string: theme.syntax.string,
    comment: theme.syntax.comment,
    number: theme.syntax.number,
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
