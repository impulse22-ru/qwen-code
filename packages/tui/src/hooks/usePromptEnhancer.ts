/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useRef } from 'react';
import { PromptEnhancer } from '@qwen-code/prompt-enhancer';
import type { EnhancedPrompt } from '@qwen-code/prompt-enhancer';

export interface UsePromptEnhancerOptions {
  level?: 'minimal' | 'standard' | 'maximal';
  projectRoot: string;
}

export const usePromptEnhancer = (options: UsePromptEnhancerOptions) => {
  const [enhancing, setEnhancing] = useState(false);
  const [lastEnhanced, setLastEnhanced] = useState<EnhancedPrompt | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const enhancerRef = useRef(new PromptEnhancer({
    level: options.level || 'standard',
    projectRoot: options.projectRoot,
  }));

  const enhancePrompt = useCallback(async (prompt: string) => {
    setEnhancing(true);
    setError(null);
    
    try {
      const result = await enhancerRef.current.enhance(prompt);
      setLastEnhanced(result);
      return result;
    } catch (_err) {
      setError('Failed to enhance prompt');
      throw _err;
    } finally {
      setEnhancing(false);
    }
  }, []);

  const updateLevel = useCallback((level: 'minimal' | 'standard' | 'maximal') => {
    enhancerRef.current = new PromptEnhancer({
      level,
      projectRoot: options.projectRoot,
    });
  }, [options.projectRoot]);

  return {
    enhancing,
    lastEnhanced,
    error,
    enhancePrompt,
    updateLevel,
  };
};
