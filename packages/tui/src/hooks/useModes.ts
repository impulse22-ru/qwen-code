/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import type { ModeDefinition } from '@qwen-code/modes';
import { BUILTIN_MODES, getBuiltinMode, CustomModeLoader } from '@qwen-code/modes';

export const useModes = (projectRoot: string) => {
  const [modes, setModes] = useState<ModeDefinition[]>([]);
  const [currentMode, setCurrentMode] = useState<ModeDefinition | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModes = async () => {
      try {
        // Load builtin modes
        const builtinModes = [...BUILTIN_MODES];

        // Load custom modes from .modes-config/
        const loader = new CustomModeLoader(projectRoot);
        const customModes = await loader.loadCustomModes();

        // Combine modes (custom modes can override builtins with same ID)
        const allModes = [...builtinModes];
        for (const customMode of customModes) {
          const existingIndex = allModes.findIndex(m => m.id === customMode.id);
          if (existingIndex >= 0) {
            allModes[existingIndex] = customMode;
          } else {
            allModes.push(customMode);
          }
        }

        setModes(allModes);
        setCurrentMode(allModes[1]); // Default to Code mode
      } catch {
        setModes(BUILTIN_MODES);
        setCurrentMode(BUILTIN_MODES[1]);
      } finally {
        setLoading(false);
      }
    };

    loadModes();
  }, [projectRoot]);

  const switchMode = useCallback(async (modeId: string) => {
    const mode = getBuiltinMode(modeId) || 
                 modes.find(m => m.id === modeId);
    
    if (mode) {
      setCurrentMode(mode);
      return mode;
    }
    return undefined;
  }, [modes]);

  const nextMode = useCallback(() => {
    if (!currentMode || modes.length === 0) return;
    
    const currentIndex = modes.findIndex(m => m.id === currentMode.id);
    const nextIndex = (currentIndex + 1) % modes.length;
    setCurrentMode(modes[nextIndex]);
  }, [currentMode, modes]);

  return {
    modes,
    currentMode,
    switchMode,
    nextMode,
    loading,
  };
};
