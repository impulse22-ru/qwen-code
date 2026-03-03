/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { Box, Text, render, useInput } from 'ink';
import {
  ActivityBar,
  Sidebar,
  Editor,
  Tabs,
  StatusBar,
  CommandPalette,
  Terminal,
} from './components/index.js';
import { useTheme, useModes, useFileSystem, usePromptEnhancer } from './hooks/index.js';
import type { Tab, CommandItem } from './types/index.js';

const App: React.FC = () => {
  const projectRoot = process.cwd();
  
  // State
  const [activeActivity, setActiveActivity] = useState('files');
  const [activeTabId, setActiveTabId] = useState('welcome.ts');
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'welcome.ts', name: 'Welcome', isActive: true },
  ]);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  // Hooks
  const { toggleTheme } = useTheme();
  const { modes, currentMode, switchMode, nextMode } = useModes(projectRoot);
  const { files, fileContent, selectFile } = useFileSystem(projectRoot);
  const { enhancing, lastEnhanced, enhancePrompt } = usePromptEnhancer({
    level: 'standard',
    projectRoot,
  });

  // Keyboard shortcuts
  useInput((input, key) => {
    // Ctrl+P: Toggle command palette
    if (key.ctrl && input === 'p') {
      setCommandPaletteOpen((prev) => !prev);
      return;
    }

    // Ctrl+M: Switch to next mode
    if (key.ctrl && input === 'm') {
      nextMode();
      return;
    }

    // Ctrl+E: Toggle sidebar
    if (key.ctrl && input === 'e') {
      setActiveActivity(activeActivity === 'files' ? '' : 'files');
      return;
    }

    // Ctrl+T: Toggle theme
    if (key.ctrl && input === 't') {
      toggleTheme();
      return;
    }

    // Ctrl+`: Toggle terminal
    if (key.ctrl && input === '`') {
      setTerminalOpen((prev) => !prev);
      return;
    }

    // Escape: Close command palette
    if (key.escape && commandPaletteOpen) {
      setCommandPaletteOpen(false);
      return;
    }
  });

  // Command execution
  const handleCommandExecute = useCallback(async (command: CommandItem) => {
    const [cmd, arg] = command.value.split(' ');

    switch (cmd) {
      case 'mode':
        if (arg) {
          await switchMode(arg);
        }
        break;
      case 'enhance':
        if (fileContent) {
          await enhancePrompt(fileContent);
        }
        break;
      case 'help':
        // Help coming soon...
        break;
      default:
        break;
    }
  }, [switchMode, enhancePrompt, fileContent]);

  // File selection
  const handleFileSelect = useCallback((filePath: string) => {
    const fileName = filePath.split('/').pop() || 'untitled';
    
    // Check if tab already exists
    const existingTab = tabs.find(t => t.id === filePath);
    if (existingTab) {
      setActiveTabId(filePath);
    } else {
      // Add new tab
      setTabs((prev) => [
        ...prev.map(t => ({ ...t, isActive: false })),
        { id: filePath, name: fileName, isActive: true },
      ]);
      setActiveTabId(filePath);
    }
    
    selectFile(filePath);
  }, [tabs, selectFile]);

  // Tab close
  const handleTabClose = useCallback((tabId: string) => {
    setTabs((prev) => {
      const newTabs = prev.filter(t => t.id !== tabId);
      if (newTabs.length === 0) {
        return [{ id: 'welcome.ts', name: 'Welcome', isActive: true }];
      }
      if (tabId === activeTabId) {
        newTabs[newTabs.length - 1].isActive = true;
        setActiveTabId(newTabs[newTabs.length - 1].id);
      }
      return newTabs;
    });
  }, [activeTabId]);

  return (
    <Box flexDirection="column">
      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onCommandExecute={handleCommandExecute}
      />

      {/* Main Area */}
      <Box flexDirection="row">
        {/* Activity Bar */}
        <ActivityBar
          activeTab={activeActivity}
          onTabChange={setActiveActivity}
        />

        {/* Sidebar */}
        {activeActivity && (
          <Sidebar
            activeSection={activeActivity as 'files' | 'modes' | 'search'}
            files={files}
            modes={modes}
            currentMode={currentMode}
            onFileSelect={handleFileSelect}
            onModeSelect={switchMode}
          />
        )}

        {/* Editor Area */}
        <Box flexDirection="column" flexGrow={1}>
          {terminalOpen ? (
            <Terminal onClose={() => setTerminalOpen(false)} />
          ) : (
            <>
              {/* Tabs */}
              <Tabs
                tabs={tabs}
                activeTabId={activeTabId}
                onTabClose={handleTabClose}
              />

              {/* Editor */}
              <Editor
                content={fileContent || '// Select a file or create new one'}
                fileName={activeTabId}
                cursorPosition={{ line: 1, column: 1 }}
              />
            </>
          )}

          {/* Prompt Enhancer Status */}
          {enhancing && (
            <Box padding={1} backgroundColor="#2d2d2d">
              <Text color="yellow">⚡ Enhancing prompt...</Text>
            </Box>
          )}

          {/* Enhancement Result */}
          {lastEnhanced && !enhancing && (
            <Box padding={1} backgroundColor="#1e3a5f">
              <Text color="green">
                ✅ Enhanced: {lastEnhanced.scores.before.overall.toFixed(1)} → 
                {lastEnhanced.scores.after.overall.toFixed(1)} (
                +{(lastEnhanced.scores.after.overall - lastEnhanced.scores.before.overall).toFixed(1)})
              </Text>
            </Box>
          )}
        </Box>
      </Box>

      {/* Status Bar */}
      <StatusBar
        line={1}
        column={1}
        language="TypeScript"
        currentMode={currentMode}
        gitBranch="feature/tui-qwen"
        promptTokenCount={lastEnhanced?.scores.after.overall}
        enhancing={enhancing}
        terminalOpen={terminalOpen}
      />
    </Box>
  );
};

export default App;

// Render the app
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  render(<App />);
}
