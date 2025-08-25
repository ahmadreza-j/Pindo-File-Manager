export interface FolderNode {
  id: string;
  parentId: string | null;
  type: "folder";
  name: string;
  children: string[];
}

export interface FileNode {
  id: string;
  parentId: string | null;
  type: "file";
  name: string;
  ext: string;
}

export type FSNode = FolderNode | FileNode;

export interface FSState {
  nodes: Record<string, FSNode>;
  rootId: string;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

export interface AppState extends FSState {
  toasts: Toast[];
}

export type FSAction =
  | { type: "HYDRATE_FROM_STORAGE"; payload: FSState }
  | { type: "ADD_FOLDER"; payload: { parentId: string; name: string } }
  | {
      type: "ADD_FILE";
      payload: { parentId: string; name: string; ext: string };
    }
  | {
      type: "RENAME_FILE";
      payload: { fileId: string; newName: string; newExt: string };
    }
  | {
      type: "RENAME_FOLDER";
      payload: { folderId: string; newName: string };
    }
  | { type: "DELETE_NODE"; payload: { nodeId: string } }
  | { type: "ADD_TOAST"; payload: Toast }
  | { type: "REMOVE_TOAST"; payload: { toastId: string } };

export interface ValidationError {
  type: "empty" | "invalid" | "duplicate";
  message: string;
}
