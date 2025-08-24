# Prompt for Claude Code

You are an expert front-end engineer and prompt-programmer. Generate a
fully working React + TypeScript implementation of a
Windows-Explorer-like **hierarchical tree file manager** that strictly
follows the specification below. Output the **entire project code** with
a clear file/folder structure (ready to `npm install && npm run dev`),
and include all key modules (components, state, validation, storage,
UI). Write high-quality, readable, production-ready code.

## Tech & Project Setup

-   Framework: **React + TypeScript** (Vite or Next.js app
    router---choose one and scaffold accordingly).
-   State management: **Context + useReducer** (or Redux Toolkit) with a
    single source of truth for the tree.
-   Styling: Simple, clean UI using semantic HTML/CSS or a lightweight
    UI library. Keep it minimal and accessible.
-   Notifications: Provide **toast** notifications (success in green,
    validation errors in red).
-   Dialogs: Provide **confirmation dialogs** for destructive actions.
-   Persistence: **localStorage** must be used to load initial state and
    persist after every successful mutation.

## Core Data Model (File System Tree)

-   One **Root folder** is automatically created on first load. **Root
    cannot be deleted or renamed**.
-   Two node types:
    -   **FolderNode**:
        `{ id, parentId, type:"folder", name, children: NodeID[] }`
    -   **FileNode**: `{ id, parentId, type:"file", name, ext }`
-   Files **cannot** have children. Only folders contain `children`.

## Required UI & Actions

Render a recursive **tree view**. For each node show operation icons as
follows:

-   **Folder nodes** show three operation icons:

    1)  **Add File** → opens a form dialog with fields:
        `File Name (required)`, `Extension (required)`.
    2)  **Add Folder** → opens a form dialog with field:
        `Folder Name (required)`.
    3)  **Delete** → opens a **confirmation dialog**; deleting a folder
        must **recursively delete** all its descendants.

-   **File nodes** show two operation icons:

    1)  **Rename (✎)** → opens a form dialog allowing editing
        `File Name` and `Extension`. On save, validation rules identical
        to Add File must be enforced.
    2)  **Delete** → deletes the file immediately after confirmation (or
        use a small confirm dialog).

-   **Root** node must **not** show Delete/Rename actions (it is
    permanent).

-   Update the tree **immediately** in the UI on successful operations
    and **persist** to localStorage.

-   Provide an illustrative default example like:

        Root/                   [📄 📂]
        ├── 📂 Documents/          [📄 📂 ❌]
        │   ├── 📄 notes.txt       [✎ ❌]
        │   └── 📂 Work/           [📄 📂 ❌]
        │       └── 📄 report.pdf  [✎ ❌]
        └── 📂 Projects/           [📄 📂 ❌]
            └── 📄 app.js          [✎ ❌]

## Validation Rules (must be enforced in reducer/business layer, not only UI)

Enforce validation **before** any state mutation; on failure, **show a
red toast** and **do not change state**.

**Validate for all create/rename operations:** 1) **Non-empty names**
(folder name, file name, extension are required where applicable). 2)
**Forbidden characters**: Reject strings containing any of:
`/ \ : * ? " < > |`. 3) **Uniqueness constraints within the same
parent**: - **Folders**: `name` must be unique among sibling folders. -
**Files**: the **combination** `name + ext` must be unique among sibling
files. - The following edge cases must hold: - `README.txt` and
`README.md` → **allowed** (different extensions). - Two folders named
`/docs` in same parent → **rejected** (duplicate folder name). - Two
files `notes.txt` in same parent → **rejected** (same name+ext). - A
folder `notes` may coexist with a file `notes.txt` → **allowed**. -
Recommended (for UX): Trim inputs and treat uniqueness
**case-insensitively**.

## System Rules

-   **Files cannot have children**---disable or hide "add" actions on
    file nodes.
-   **Root is permanent**: cannot be deleted or renamed.
-   **Recursive delete**: Deleting a folder must delete all descendants;
    show a confirmation dialog like: \> "Are you sure you want to delete
    this folder and all of its contents?"

## UX Requirements

-   **Toasts**:
    -   Success (green) after successful add/rename/delete.

    -   Error (red) for validation failures; examples of messages:

        ``` ts
        const errors = {
          duplicate: "Name already exists",
          invalid: "Contains forbidden characters",
          empty: "Name or extension cannot be empty"
        };
        ```

    -   For duplicate files, show the explicit conflicting name, e.g.,
        `"file.png already exists"`.
-   **Dialogs**:
    -   Create Folder (Folder Name)
    -   Create File (File Name, Extension)
    -   Rename File (File Name, Extension)
    -   Confirm Delete (for both files and folders; destructive actions
        must ask confirmation)

## State Management & Persistence

-   Implement a reducer with actions like:
    -   `ADD_FOLDER(parentId, name)`
    -   `ADD_FILE(parentId, name, ext)`
    -   `RENAME_FILE(fileId, newName, newExt)`
    -   `DELETE_NODE(nodeId)` (handles recursive delete if node is a
        folder)
    -   `HYDRATE_FROM_STORAGE()`
-   On every successful mutation, **persist**:\
    `localStorage.setItem("fs", JSON.stringify(state))`
-   On app mount, **hydrate** from localStorage if present; otherwise
    create the **Root** folder.

## Code Organization (suggested)

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

## Implementation Details & Gotchas

-   **Enforce validation in reducer** so state never becomes invalid (UI
    cannot bypass rules).
-   **Trim** inputs and normalize case when comparing for uniqueness; do
    not mutate names beyond trimming.
-   **Do not modify state on validation failure**; instead show an error
    toast and keep UI unchanged.
-   Disable delete/rename controls on **Root**.
-   For files, hide/disable any "add" actions (they cannot have
    children).
-   Use stable IDs (e.g., `crypto.randomUUID()`).

## Deliverables

1)  Complete runnable project with all source files.
2)  **Include a README.md** in the generated project that explains
    clearly how to install, run, and develop the project so any
    developer can get started immediately.
3)  Clear instructions in the output:
    -   How to run: `npm install` then `npm run dev`
4)  Include a small seeded example (as illustrated) on first load if
    localStorage is empty.
5)  Provide **manual test checklist** covering:
    -   Adding folder with empty/forbidden chars → rejected (red toast).
    -   Adding file with duplicate name+ext in same parent → rejected;
        state unchanged.
    -   Renaming file causing a collision → rejected.
    -   Attempting to add children under a file → impossible via UI.
    -   Deleting a deep folder → recursively removed after confirmation;
        success toast.
    -   Root cannot be deleted/renamed.
6)  Include brief notes on how uniqueness is implemented
    (case-insensitive compare recommended).

## Output Format

-   Print the full file tree and then **each file's content** inline
    with proper fencing (`ts,`tsx, \`\`\`json, etc.).
-   Ensure the code runs without external API keys and no network access
    is required.

If anything is ambiguous, make the most sensible choice that improves UX
while adhering to the above constraints. Then proceed to generate the
full project code now.
