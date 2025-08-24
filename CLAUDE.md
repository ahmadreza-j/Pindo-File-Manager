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

### Expected File Structure
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
  /state
    fsTypes.ts
    fsReducer.ts
    fsContext.tsx
    validators.ts
    storage.ts
    helpers.ts
  /icons
  App.tsx
  main.tsx
index.html
```

## Development Commands

Since this is a new project, the standard React development commands will be:
- `npm install` - Install dependencies
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests (if configured)
- `npm run lint` - Run linter (if configured)

## Key Implementation Requirements

### State Management
Implement reducer actions:
- `ADD_FOLDER(parentId, name)`
- `ADD_FILE(parentId, name, ext)`
- `RENAME_FILE(fileId, newName, newExt)`
- `DELETE_NODE(nodeId)` (handles recursive delete)
- `HYDRATE_FROM_STORAGE()`

### Validation Rules (Enforced in Reducer)
1. **Non-empty names** required for all operations
2. **Forbidden characters**: `/ \ : * ? " < > |`
3. **Uniqueness constraints**:
   - Folders: `name` must be unique among siblings
   - Files: `name + ext` combination must be unique among siblings
   - Case-insensitive comparison recommended
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
5. **Immediate UI updates** with localStorage persistence
6. **Toast notifications** for success (green) and errors (red)

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