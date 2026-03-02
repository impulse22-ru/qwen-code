/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Theme } from '../types/index.js';

export const lightTheme: Theme = {
  colors: {
    background: '#ffffff',
    foreground: '#333333',
    activityBar: '#f3f3f3',
    sidebar: '#f3f3f3',
    editor: '#ffffff',
    statusBar: '#007acc',
    tabs: '#ececec',
    activeTab: '#ffffff',
    lineNumbers: '#237893',
    selection: '#add6ff',
    border: '#e4e4e4',
  },
  syntax: {
    keyword: '#0000ff',
    string: '#a31515',
    function: '#795e26',
    comment: '#008000',
    number: '#098658',
    operator: '#000000',
    type: '#267f99',
  },
};
