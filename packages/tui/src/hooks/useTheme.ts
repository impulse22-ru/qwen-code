/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { darkTheme, lightTheme } from '../themes/index.js';
import type { Theme } from '../types/index.js';

export type ThemeName = 'dark' | 'light';

export const useTheme = () => {
  const [themeName, setThemeName] = useState<ThemeName>('dark');

  const toggleTheme = useCallback(() => {
    setThemeName((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const currentTheme: Theme = themeName === 'dark' ? darkTheme : lightTheme;

  return {
    themeName,
    currentTheme,
    toggleTheme,
    setTheme: setThemeName,
  };
};
