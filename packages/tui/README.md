# TUI Qwen - VSCode-like Terminal UI

VSCode-like Terminal User Interface for Qwen Code with full integration of Modes, Prompt Enhancer, and more.

## 🚀 Quick Start

### Install Dependencies

```bash
cd /Users/qmode/Documents/trae_projects/VibeCoder/qwen-code
npm install
```

### Build TUI

```bash
npm run build --workspace=@qwen-code/tui
```

### Run TUI

```bash
cd packages/tui
npm run dev
```

Or from root:

```bash
npm run start:tui
```

## 🎮 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+P` | Toggle Command Palette |
| `Ctrl+M` | Switch to next mode |
| `Ctrl+E` | Toggle sidebar |
| `Ctrl+T` | Toggle theme (Dark/Light) |
| `Esc` | Close command palette |

## 🎭 Modes Integration

The TUI fully integrates with Qwen Code Modes:

- **📐 Architect** - Design and planning
- **💻 Code** - Writing and refactoring code
- **❓ Ask** - Questions and explanations
- **🐛 Debug** - Bug fixing
- **🔍 Review** - Code review
- **🎯 Orchestrator** - Task coordination

Switch modes via:
- Command Palette (`Ctrl+P`): `/mode architect`
- Keyboard: `Ctrl+M` to cycle
- Sidebar: Click on mode name

## ✨ Prompt Enhancer

Integrated Prompt Enhancer with quality scoring:

- Enhance prompts directly in the editor
- See quality score improvements in status bar
- Supports 3 enhancement levels: minimal, standard, maximal

## 🎨 Themes

Two built-in themes:

- **Dark** (VSCode Default) - Default theme
- **Light** - Light theme alternative

Toggle with `Ctrl+T`

## 📁 Features

- ✅ Activity Bar with icons
- ✅ File Explorer sidebar
- ✅ Modes sidebar
- ✅ Syntax-highlighted editor
- ✅ Tabbed interface
- ✅ Status bar with mode info
- ✅ Command palette
- ✅ Full Modes integration
- ✅ Prompt Enhancer integration
- ✅ Dark/Light themes

## 🏗️ Architecture

```
packages/tui/
├── src/
│   ├── components/       # UI components
│   │   ├── ActivityBar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Editor.tsx
│   │   ├── Tabs.tsx
│   │   ├── StatusBar.tsx
│   │   └── CommandPalette.tsx
│   ├── hooks/            # React hooks
│   │   ├── useTheme.ts
│   │   ├── useModes.ts
│   │   ├── usePromptEnhancer.ts
│   │   └── useFileSystem.ts
│   ├── themes/           # Color themes
│   │   ├── dark.ts
│   │   └── light.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── utils/            # Utilities
│   │   └── syntax-highlight.ts
│   └── App.tsx           # Main component
├── package.json
├── tsconfig.json
└── README.md
```

## 🔗 Integration

The TUI integrates with:

- `@qwen-code/modes` - Mode management
- `@qwen-code/prompt-enhancer` - Prompt enhancement
- `@qwen-code/qwen-code-core` - Core functionality

## 📝 TODO

- [ ] Full file system navigation
- [ ] Git integration
- [ ] Search functionality
- [ ] Terminal integration
- [ ] Settings panel
- [ ] Extensions support
- [ ] Custom keybindings
- [ ] Multiple editor panes

## 📄 License

Apache-2.0
