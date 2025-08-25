# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript hierarchical file manager application (similar to Windows Explorer) that implements a tree-based file system interface. The project follows the detailed specification in `claude_code_prompt.md`.

## Project Architecture

### Tech Stack
- **Framework**: React + TypeScript (Vite)
- **State Management**: Context + useReducer (or Redux Toolkit) with single source of truth
- **Styling**: Semantic HTML/CSS or lightweight UI library (minimal and accessible)
- **Persistence**: localStorage for state persistence
- **UI Components**: Toast notifications and confirmation dialogs

### Core Data Model
The application manages a hierarchical file system with:
- **Root folder** (permanent, cannot be deleted/renamed)
- **FolderNode**: `{ id, parentId, type:"folder", name, children: NodeID[] }`
- **FileNode**: `{ id, parentId, type:"file", name, ext }`
- Files cannot have children, only folders can contain other nodes

### Actual File Structure
```
/src
  /components
    Tree.tsx
    NodeRow.tsx
    DialogCreateFolder.tsx
    DialogCreateFile.tsx
    DialogRenameFile.tsx
    ConfirmDeleteDialog.tsx
    Toasts.tsx
    ErrorBoundary.tsx
  /state
    fsTypes.ts
    fsReducer.ts
    fsContext.tsx
    validators.ts
    storage.ts
    helpers.ts
  /constants
    index.ts
  App.tsx
  App.css
  index.css
  main.tsx
```

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (Vite)
- `npm run build` - TypeScript compile + Vite build for production
- `npm run lint` - ESLint with TypeScript support (--max-warnings 0)
- `npm run preview` - Preview production build locally

## Key Implementation Requirements

### State Management
The application uses React Context + useReducer pattern. All state mutations go through the reducer:
- `ADD_FOLDER(parentId, name)` - Creates folder with validation
- `ADD_FILE(parentId, name, ext)` - Creates file with validation
- `RENAME_FILE(fileId, newName, newExt)` - Renames file with collision checking
- `DELETE_NODE(nodeId)` - Recursive deletion with root protection
- `HYDRATE_FROM_STORAGE()` - Loads state from localStorage
- `ADD_TOAST/REMOVE_TOAST` - Toast notification management

### Constants and Configuration
- Constants are centralized in `src/constants/index.ts`
- Forbidden characters: `/ \ : * ? " < > |`
- Storage key: `"fs"`
- Toast duration: 4000ms
- Tree indentation: 20px per level

### Validation Rules (Enforced in Reducer)
1. **Non-empty names** required for all operations
2. **Forbidden characters**: Uses `FORBIDDEN_CHARS_REGEX` from constants
3. **Uniqueness constraints**:
   - Folders: `name` must be unique among siblings
   - Files: `name + ext` combination must be unique among siblings
   - Case-insensitive comparison
   - Folder and file with same name can coexist

### UI Operations
- **Folders**: Add File, Add Folder, Delete (with recursive confirmation)
- **Files**: Rename, Delete (with confirmation)
- **Root**: Only Add File and Add Folder (no delete/rename)

### Persistence Strategy
- Save to localStorage after every successful mutation
- Load from localStorage on app mount
- Create default example structure if localStorage is empty

## Critical Business Rules

1. **Validation must be enforced in reducer** - UI cannot bypass validation
2. **Root node is permanent** - disable delete/rename operations  
3. **Files cannot have children** - hide/disable add actions on file nodes
4. **Recursive deletion** - folders delete all descendants with confirmation
5. **Immediate UI updates** with localStorage persistence after every mutation
6. **Toast notifications** for success and errors (auto-dismiss after 4s)
7. **Error boundary** wraps the entire application for crash protection

## Default Example Structure
When localStorage is empty, seed with:
```
Root/
├── Documents/
│   ├── notes.txt
│   └── Work/
│       └── report.pdf
└── Projects/
    └── app.js
```

## Testing Checklist
Key test scenarios to verify:
- Empty/forbidden character validation
- Duplicate name detection within same parent
- File rename collision detection
- Folder recursive deletion with confirmation
- Root node protection (no delete/rename)
- localStorage persistence after operations