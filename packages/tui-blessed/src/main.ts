/**
 * @license
 * Copyright 2026 Qmode
 * SPDX-License-Identifier: Apache-2.0
 */

import * as blessed from 'neo-blessed';
import * as contrib from 'blessed-contrib';
import { highlight } from 'cli-highlight';
import type { ModeDefinition } from '@qwen-code/modes';
import { BUILTIN_MODES } from '@qwen-code/modes';

interface Colors {
  bg: string;
  sidebarBg: string;
  activityBg: string;
  statusBarBg: string;
  text: string;
  accent: string;
}

class VSCodeLikeTUI {
  private screen: blessed.Widgets.Screen;
  private grid: any;
  private colors: Colors;

  // Components
  private activityBar: blessed.Widgets.BoxElement;
  private sidebar: any;
  private editorTabs: blessed.Widgets.BoxElement;
  private editor: blessed.Widgets.BoxElement;
  private terminal: blessed.Widgets.BoxElement;
  private statusBar: blessed.Widgets.BoxElement;

  // State
  private currentMode?: ModeDefinition;
  private modes: ModeDefinition[] = [];

  constructor() {
    this.modes = BUILTIN_MODES;
    this.currentMode = this.modes[1]; // Default to Code mode

    // Colors (VSCode Dark+)
    this.colors = {
      bg: '#1e1e1e',
      sidebarBg: '#252526',
      activityBg: '#333333',
      statusBarBg: '#007acc',
      text: '#cccccc',
      accent: '#0e639c',
    };

    // 1. Create screen
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'Qwen Code TUI',
      fullUnicode: true,
    });

    // 2. Create grid (12x12)
    this.grid = new contrib.grid({ rows: 12, cols: 12, screen: this.screen });

    this.createActivityBar();
    this.createSidebar();
    this.createEditor();
    this.createTerminal();
    this.createStatusBar();
    this.setupKeyBindings();
    this.renderSampleCode();
  }

  private createActivityBar() {
    // Activity Bar (leftmost icons)
    this.activityBar = this.grid.set(0, 0, 12, 1, blessed.box, {
      style: { bg: this.colors.activityBg },
      content: this.getActivityBarContent(),
      tags: true,
      valign: 'top',
      padding: { top: 1 },
    });
  }

  private getActivityBarContent(): string {
    const icons = [
      { id: 'files', icon: '📁' },
      { id: 'search', icon: '🔍' },
      { id: 'git', icon: '🌿' },
      { id: 'debug', icon: '🐛' },
      { id: 'modes', icon: '🎭' },
      { id: 'settings', icon: '⚙️' },
    ];

    return icons.map((item, i) => {
      const isActive = i === 0;
      const style = isActive ? `{bold}{#ffffff-fg}${item.icon}{/#}{/bold}` : `{#888888-fg}${item.icon}{/}`;
      return `{center}${style}{/center}\n`;
    }).join('');
  }

  private createSidebar() {
    // Sidebar (File Explorer)
    this.sidebar = this.grid.set(0, 1, 12, 3, contrib.tree, {
      style: {
        bg: this.colors.sidebarBg,
        fg: this.colors.text,
        selected: { bg: this.colors.accent, fg: 'white' },
      },
      label: ' EXPLORER ',
      labelStyle: { bg: this.colors.sidebarBg, fg: this.colors.text },
      template: { lines: true },
      keys: ['up', 'down', 'enter'],
    });

    this.populateFileTree();

    // Handle file selection
    this.sidebar.on('select', (node: any) => {
      if (node.name && !node.children) {
        // It's a file
        this.openFile(node.name);
      }
    });
  }

  private populateFileTree() {
    const fileTree = {
      extended: true,
      children: {
        '📁 src': {
          extended: true,
          children: {
            '📄 main.ts': {},
            '📄 App.tsx': {},
            '📄 utils.ts': {},
          },
        },
        '📁 packages': {
          extended: true,
          children: {
            '📁 cli': {
              children: {
                '📄 package.json': {},
              },
            },
            '📁 core': {
              children: {
                '📄 package.json': {},
              },
            },
          },
        },
        '📄 package.json': {},
        '📄 tsconfig.json': {},
        '📄 README.md': {},
      },
    };

    this.sidebar.setData(fileTree);
  }

  private createEditor() {
    // Editor Tabs
    this.editorTabs = blessed.box({
      parent: this.screen,
      top: 0,
      left: '33%',
      width: '67%',
      height: 1,
      style: { bg: this.colors.activityBg },
      content: '  {bold}main.ts{/bold}    App.tsx    ',
      tags: true,
    });

    // Editor (Code)
    this.editor = this.grid.set(0, 4, 9, 8, blessed.box, {
      style: { bg: this.colors.bg },
      label: ` ${this.currentMode?.icon || '💻'} ${this.currentMode?.name || 'Code'} `,
      keys: true,
      vi: true,
      scrollable: true,
      alwaysScroll: true,
      scrollbar: {
        ch: ' ',
        track: { bg: 'gray' },
        style: { inverse: true },
      },
    });
  }

  private createTerminal() {
    // Terminal / Panel
    this.terminal = this.grid.set(9, 4, 3, 8, blessed.box, {
      label: ' TERMINAL ',
      style: { bg: '#000000', fg: '#ffffff' },
      content: '{green-fg}user@qwen-code{/} $ npm run dev\n{yellow-fg}> Starting development server...{/}\n',
      tags: true,
      keys: true,
    });
  }

  private createStatusBar() {
    // Status Bar
    this.statusBar = this.grid.set(11, 0, 1, 12, blessed.box, {
      style: { bg: this.colors.statusBarBg, fg: 'white' },
      content: ` ${this.currentMode?.icon || ''} ${this.currentMode?.name || 'Code'} | main {bold}TypeScript{/bold} | Ln 1, Col 1 | UTF-8 | LF `,
      tags: true,
    });
  }

  private setupKeyBindings() {
    // Exit on Escape or q
    this.screen.key(['escape', 'q', 'C-c'], () => {
      process.exit(0);
    });

    // Focus switching
    this.screen.key(['e'], () => {
      this.editor.focus();
      this.screen.render();
    });

    this.screen.key(['t'], () => {
      this.terminal.focus();
      this.screen.render();
    });

    this.screen.key(['f'], () => {
      this.sidebar.focus();
      this.screen.render();
    });

    // Mode switching (Ctrl+M)
    this.screen.key(['C-m'], () => {
      this.switchMode();
    });

    // Refresh display
    this.screen.key(['C-r'], () => {
      this.screen.render();
    });
  }

  private switchMode() {
    const currentIndex = this.modes.findIndex(m => m.id === this.currentMode?.id);
    const nextIndex = (currentIndex + 1) % this.modes.length;
    this.currentMode = this.modes[nextIndex];

    // Update editor label
    if (this.editor) {
      this.editor.setLabel(` ${this.currentMode.icon} ${this.currentMode.name} `);
    }

    // Update status bar
    if (this.statusBar) {
      this.statusBar.setContent(
        ` ${this.currentMode.icon} ${this.currentMode.name} | main {bold}TypeScript{/bold} | Ln 1, Col 1 | UTF-8 | LF `
      );
    }

    this.screen.render();
  }

  private openFile(filename: string) {
    // In real implementation, read file content
    this.editor.setLabel(` ${filename} `);
    this.renderSampleCode();
    this.screen.render();
  }

  private renderSampleCode() {
    const code = `import { Server } from 'http';
import { modes } from '@qwen-code/modes';
import { PromptEnhancer } from '@qwen-code/prompt-enhancer';

const PORT = 3000;

// Initialize Qwen Code TUI
async function main() {
  console.log("🚀 Qwen Code TUI starting...");
  
  // Create prompt enhancer
  const enhancer = new PromptEnhancer({
    level: 'standard',
    projectRoot: process.cwd()
  });

  // Enhance a prompt
  const result = await enhancer.enhance('Fix the bug');
  console.log('Enhanced:', result.enhanced);
  
  // Start server
  const server = new Server((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from Qwen Code TUI!\\n');
  });

  server.listen(PORT, () => {
    console.log(\`Server running at http://localhost:\${PORT}/\`);
  });
}

main().catch(console.error);`;

    // Syntax highlighting
    const highlightedCode = highlight(code, {
      language: 'typescript',
      theme: 'dark-plus',
    });

    this.editor.setContent(highlightedCode);
  }

  public render() {
    this.screen.render();
  }
}

// Main entry point
const app = new VSCodeLikeTUI();
app.render();

console.log('Qwen Code TUI started! Press Escape or q to exit.');
