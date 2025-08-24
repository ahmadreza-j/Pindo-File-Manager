# Pindo File Manager

A Windows Explorer-like hierarchical tree file manager built with React + TypeScript. This application provides a complete file system interface with folders, files, and full CRUD operations.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Tree.tsx        # Main tree view component
│   ├── NodeRow.tsx     # Individual tree node renderer
│   ├── DialogCreateFolder.tsx
│   ├── DialogCreateFile.tsx
│   ├── DialogRenameFile.tsx
│   ├── ConfirmDeleteDialog.tsx
│   └── Toasts.tsx      # Notification system
├── state/              # State management
│   ├── fsTypes.ts      # TypeScript type definitions
│   ├── fsReducer.ts    # State reducer with actions
│   ├── fsContext.tsx   # React context provider
│   ├── validators.ts   # Input validation logic
│   ├── storage.ts      # localStorage utilities
│   └── helpers.ts      # State manipulation helpers
├── App.tsx            # Main application component
├── main.tsx          # Application entry point
├── App.css           # Component styles
└── index.css         # Global styles
```

## ✨ Features

### Core Functionality
- **Hierarchical Tree Structure**: Windows Explorer-like file system interface
- **Two Node Types**: Folders (can contain children) and Files (leaf nodes)
- **Persistent Storage**: All changes automatically saved to localStorage
- **Default Example**: Seeded with sample folder/file structure on first load

### File Operations
- **Create Folders**: Add new folders to any parent folder
- **Create Files**: Add new files with name and extension
- **Rename Files**: Edit file name and extension
- **Delete Nodes**: Remove files or folders (with recursive deletion for folders)
- **Protected Root**: Root folder cannot be deleted or renamed

### User Experience
- **Toast Notifications**: Success (green) and error (red) feedback
- **Confirmation Dialogs**: Safe deletion with user confirmation
- **Real-time Validation**: Immediate feedback on invalid inputs
- **Responsive UI**: Clean, accessible interface design

## 📋 Validation Rules

The application enforces strict validation rules at the business logic level:

### Name Validation
- **Non-empty names**: All names and extensions are required
- **Forbidden characters**: Rejects strings containing: `/ \ : * ? " < > |`
- **Trimmed input**: Automatically trims whitespace

### Uniqueness Constraints
- **Folders**: Name must be unique among sibling folders (case-insensitive)
- **Files**: Name + extension combination must be unique among sibling files
- **Coexistence**: A folder and file can have the same name in the same parent

### Examples
✅ **Allowed**:
- `README.txt` and `README.md` (different extensions)
- Folder `notes` and file `notes.txt` (different types)

❌ **Rejected**:
- Two folders named `docs` in same parent
- Two files `notes.txt` in same parent
- Names containing forbidden characters like `file/name.txt`

## 🧪 Manual Testing Checklist

### Validation Testing
- [ ] Create folder with empty name → Red toast, no state change
- [ ] Create file with forbidden characters (`file*.txt`) → Red toast, no state change
- [ ] Create duplicate folder name in same parent → Red toast, no state change
- [ ] Create file with duplicate name+extension → Red toast, no state change
- [ ] Rename file to existing name+extension → Red toast, no state change

### Functionality Testing
- [ ] Create folder → Success toast, immediately visible in tree
- [ ] Create file → Success toast, immediately visible in tree
- [ ] Rename file → Success toast, name updated in tree
- [ ] Delete file → Confirmation dialog → Success toast, removed from tree
- [ ] Delete folder → Confirmation dialog → Success toast, folder and all contents removed
- [ ] Try to delete root → Error toast, root remains unchanged

### UI/UX Testing
- [ ] Files show only rename and delete actions (no add actions)
- [ ] Folders show add file, add folder, and delete actions
- [ ] Root shows only add file and add folder actions (no delete/rename)
- [ ] Toast notifications auto-dismiss after 4 seconds
- [ ] Can manually dismiss toasts with × button
- [ ] Dialogs close on backdrop click or × button

### Persistence Testing
- [ ] Create items → Refresh page → Items still exist
- [ ] Delete items → Refresh page → Items still deleted
- [ ] Rename items → Refresh page → Names still changed
- [ ] Clear localStorage → Refresh → Default example structure appears

## 🏛️ Architecture Details

### State Management
- **Single Source of Truth**: All file system state centralized in reducer
- **Immutable Updates**: State changes create new objects (no mutations)
- **Action-based**: All operations dispatched as actions (ADD_FOLDER, DELETE_NODE, etc.)
- **Context Provider**: React context provides state and dispatch to all components

### Validation Strategy
- **Business Logic Validation**: All validation enforced in reducer before state changes
- **UI Cannot Bypass**: Frontend validation is supplementary, not primary
- **Early Return**: Invalid operations immediately return error toasts
- **Case-insensitive Uniqueness**: Names compared using `.toLowerCase()`

### Storage Implementation
- **Automatic Persistence**: Every successful mutation triggers localStorage save
- **Hydration on Load**: App initialization loads from localStorage if available
- **Fallback to Default**: Creates sample structure if no saved state exists
- **Error Handling**: Graceful fallback if localStorage fails

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

### Tech Stack
- **React 18** with hooks and functional components
- **TypeScript** for type safety and better development experience
- **Vite** for fast development and optimized builds
- **Context + useReducer** for state management
- **CSS3** with modern features (Grid, Flexbox, animations)

### Key Design Decisions
- **No External Dependencies**: Pure React/TypeScript implementation
- **Stable IDs**: Uses `crypto.randomUUID()` for consistent node identification  
- **Recursive Operations**: Folder deletion cascades to all descendants
- **Immutable State**: All state updates create new objects for React optimization
- **Accessibility**: Proper ARIA labels, keyboard navigation, semantic HTML

## 📝 License

This project is created as a demonstration and is available for educational purposes.