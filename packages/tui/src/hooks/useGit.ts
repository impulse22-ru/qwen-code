/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { execSync } from 'child_process';
import type { GitStatus } from '../components/GitPanel.js';

export const useGit = (cwd: string) => {
  const [status, setStatus] = useState<GitStatus | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getGitStatus = useCallback((): GitStatus | undefined => {
    try {
      // Check if in git repo
      try {
        execSync('git rev-parse --git-dir', { cwd, stdio: 'pipe' });
      } catch {
        return undefined;
      }

      // Get current branch
      const branch = execSync('git rev-parse --abbrev-ref HEAD', {
        cwd,
        encoding: 'utf-8',
      }).trim();

      // Get ahead/behind count
      const aheadBehind = execSync('git rev-list --left-right --count HEAD...@{upstream}', {
        cwd,
        encoding: 'utf-8',
      }).trim().split(/\s+/);
      const ahead = parseInt(aheadBehind[0] || '0', 10);
      const behind = parseInt(aheadBehind[1] || '0', 10);

      // Get status
      const statusOutput = execSync('git status --porcelain', {
        cwd,
        encoding: 'utf-8',
      });

      const modified: string[] = [];
      const added: string[] = [];
      const deleted: string[] = [];
      const untracked: string[] = [];

      statusOutput.split('\n').forEach((line) => {
        if (!line.trim()) return;
        
        const statusChar = line[0];
        const file = line.slice(3).trim();

        switch (statusChar) {
          case 'M':
          case 'U':
            modified.push(file);
            break;
          case 'A':
          case 'C':
            added.push(file);
            break;
          case 'D':
            deleted.push(file);
            break;
          case '?':
            untracked.push(file);
            break;
        }
      });

      return {
        branch,
        ahead,
        behind,
        modified,
        added,
        deleted,
        untracked,
      };
    } catch (err: any) {
      setError(err.message || 'Failed to get git status');
      return undefined;
    }
  }, [cwd]);

  useEffect(() => {
    const loadStatus = () => {
      const gitStatus = getGitStatus();
      setStatus(gitStatus);
      setLoading(false);
    };

    loadStatus();

    // Refresh every 5 seconds
    const interval = setInterval(loadStatus, 5000);
    return () => clearInterval(interval);
  }, [cwd, getGitStatus]);

  const refresh = useCallback(() => {
    const gitStatus = getGitStatus();
    setStatus(gitStatus);
  }, [getGitStatus]);

  return {
    status,
    loading,
    error,
    refresh,
  };
};
