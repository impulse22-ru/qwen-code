# TUI Qwen - Blessed Implementation

VSCode-like Terminal UI using **neo-blessed** and **blessed-contrib**.

## 🚀 Quick Start

### Install Dependencies

```bash
cd packages/tui-blessed
npm install
```

### Run

```bash
npm run dev
```

Or from root:

```bash
npm run build --workspace=@qwen-code/tui-blessed
npm run start --workspace=@qwen-code/tui-blessed
```

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Escape` / `q` | Exit |
| `Ctrl+C` | Exit |
| `e` | Focus Editor |
| `t` | Focus Terminal |
| `f` | Focus File Tree |
| `Ctrl+M` | Switch Mode |
| `Ctrl+R` | Refresh |
| `↑/↓` | Navigate in tree |
| `Enter` | Select file |

## 📁 Features

- ✅ Activity Bar with icons
- ✅ File Explorer tree (blessed-contrib)
- ✅ Syntax-highlighted editor (cli-highlight)
- ✅ Tabbed interface
- ✅ Terminal panel
- ✅ Status bar with mode info
- ✅ Full Modes integration
- ✅ VSCode Dark+ theme

## 🎨 Architecture

```
┌────────────────────────────────────────────┐
│ Activity │ Sidebar    │ Editor (8 cols)   │
│ Bar (1)  │ (3 cols)   │                   │
│          │            │                   │
│ 📁       │ 📁 EXPLORER│  main.ts    ×     │
│ 🔍       │ 📂 src     ├───────────────────│
│ 🌿       │   📄 main.ts│ import React...  │
│ 🐛       │   📄 App.tsx│                  │
│ 🎭       │ 📄 pkg.json│                  │
│ ⚙️       │            │                  │
├──────────┴────────────┴───────────────────┤
│ TERMINAL                                  │
│ $ npm run dev                             │
├───────────────────────────────────────────┤
│ 📐 Code | TypeScript | Ln 1, Col 1 | UTF-8│
└───────────────────────────────────────────┘
```

## 🔗 Integration

This implementation integrates with:

- `@qwen-code/modes` - Mode switching (Ctrl+M)
- `@qwen-code/prompt-enhancer` - Future integration
- `@qwen-code/qwen-code-core` - Core functionality

## 📝 Comparison: Ink vs Blessed

| Feature | Ink (React) | Blessed |
|---------|-------------|---------|
| **Learning Curve** | Easy (React) | Medium |
| **Performance** | Good | Excellent |
| **Mouse Support** | Limited | Full |
| **Widgets** | Basic | Rich (trees, tables) |
| **TypeScript** | Excellent | Good |
| **Best For** | Simple UIs | Complex TUIs |

## 🛠️ Dependencies

- **neo-blessed** - Terminal UI framework
- **blessed-contrib** - Pre-built widgets (trees, charts)
- **cli-highlight** - Syntax highlighting

## 📖 Example Usage

```typescript
import { VSCodeLikeTUI } from '@qwen-code/tui-blessed';

const app = new VSCodeLikeTUI();
app.render();
```

## 🎯 Next Steps

- [ ] Real file system integration
- [ ] Multiple editor tabs
- [ ] Integrated terminal (node-pty)
- [ ] Command palette
- [ ] Settings panel
- [ ] Git integration

## 📄 License

Apache-2.0
