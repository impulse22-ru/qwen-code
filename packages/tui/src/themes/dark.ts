/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Theme } from '../types/index.js';

export const darkTheme: Theme = {
  colors: {
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    activityBar: '#333333',
    sidebar: '#252526',
    editor: '#1e1e1e',
    statusBar: '#007acc',
    tabs: '#2d2d2d',
    activeTab: '#1e1e1e',
    lineNumbers: '#858585',
    selection: '#264f78',
    border: '#3e3e42',
  },
  syntax: {
    keyword: '#569cd6',
    string: '#ce9178',
    function: '#dcdcaa',
    comment: '#6a9955',
    number: '#b5cea8',
    operator: '#d4d4d4',
    type: '#4ec9b0',
  },
};
