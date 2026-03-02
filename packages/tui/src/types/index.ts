/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ModeDefinition } from '@qwen-code/modes';

export interface FileTreeItem {
  name: string;
  type: 'file' | 'directory';
  children?: FileTreeItem[];
  path: string;
}

export interface Tab {
  id: string;
  name: string;
  isActive: boolean;
  isModified?: boolean;
}

export interface EditorCursor {
  line: number;
  column: number;
}

export interface TUIState {
  activeActivity: string;
  activeSidebar: string;
  currentMode?: ModeDefinition;
  tabs: Tab[];
  activeTabId: string;
  fileContent: string;
  cursorPosition: EditorCursor;
}

export interface ThemeColors {
  background: string;
  foreground: string;
  activityBar: string;
  sidebar: string;
  editor: string;
  statusBar: string;
  tabs: string;
  activeTab: string;
  lineNumbers: string;
  selection: string;
  border: string;
}

export interface SyntaxColors {
  keyword: string;
  string: string;
  function: string;
  comment: string;
  number: string;
  operator: string;
  type: string;
}

export interface Theme {
  colors: ThemeColors;
  syntax: SyntaxColors;
}

export interface CommandItem {
  label: string;
  value: string;
  description: string;
  action?: () => void;
}
