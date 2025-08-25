import { AppState, FSAction, Toast } from "./fsTypes";
import {
  validateFolderCreation,
  validateFileCreation,
  validateFileRename,
  validateFolderRename,
} from "./validators";
import { deleteNodeRecursive, addNodeToParent } from "./helpers";
import { saveToStorage } from "./storage";

const createToast = (message: string, type: "success" | "error"): Toast => ({
  id: crypto.randomUUID(),
  message,
  type,
});

export const fsReducer = (state: AppState, action: FSAction): AppState => {
  switch (action.type) {
    case "HYDRATE_FROM_STORAGE": {
      return {
        ...state,
        nodes: action.payload.nodes,
        rootId: action.payload.rootId,
      };
    }

    case "ADD_FOLDER": {
      const { parentId, name } = action.payload;

      // Validate
      const validationError = validateFolderCreation(state, parentId, name);
      if (validationError) {
        return {
          ...state,
          toasts: [
            ...state.toasts,
            createToast(validationError.message, "error"),
          ],
        };
      }

      // Create new folder
      const folderId = crypto.randomUUID();
      const trimmedName = name.trim();

      const newNodes = { ...state.nodes };
      newNodes[folderId] = {
        id: folderId,
        parentId,
        type: "folder",
        name: trimmedName,
        children: [],
      };

      const newState = {
        ...state,
        nodes: newNodes,
      };

      // Add to parent
      const updatedState = addNodeToParent(newState, parentId, folderId);

      // Save to storage
      saveToStorage({ nodes: updatedState.nodes, rootId: updatedState.rootId });

      return {
        ...updatedState,
        toasts: [
          ...state.toasts,
          createToast(
            `Folder "${trimmedName}" created successfully`,
            "success"
          ),
        ],
      };
    }

    case "ADD_FILE": {
      const { parentId, name, ext } = action.payload;

      // Validate
      const validationError = validateFileCreation(state, parentId, name, ext);
      if (validationError) {
        return {
          ...state,
          toasts: [
            ...state.toasts,
            createToast(validationError.message, "error"),
          ],
        };
      }

      // Create new file
      const fileId = crypto.randomUUID();
      const trimmedName = name.trim();
      const trimmedExt = ext.trim();

      const newNodes = { ...state.nodes };
      newNodes[fileId] = {
        id: fileId,
        parentId,
        type: "file",
        name: trimmedName,
        ext: trimmedExt,
      };

      const newState = {
        ...state,
        nodes: newNodes,
      };

      // Add to parent
      const updatedState = addNodeToParent(newState, parentId, fileId);

      // Save to storage
      saveToStorage({ nodes: updatedState.nodes, rootId: updatedState.rootId });

      return {
        ...updatedState,
        toasts: [
          ...state.toasts,
          createToast(
            `File "${trimmedName}.${trimmedExt}" created successfully`,
            "success"
          ),
        ],
      };
    }

    case "RENAME_FILE": {
      const { fileId, newName, newExt } = action.payload;

      // Validate
      const validationError = validateFileRename(
        state,
        fileId,
        newName,
        newExt
      );
      if (validationError) {
        return {
          ...state,
          toasts: [
            ...state.toasts,
            createToast(validationError.message, "error"),
          ],
        };
      }

      const file = state.nodes[fileId];
      if (!file || file.type !== "file") {
        return {
          ...state,
          toasts: [...state.toasts, createToast("File not found", "error")],
        };
      }

      const trimmedName = newName.trim();
      const trimmedExt = newExt.trim();

      const newNodes = { ...state.nodes };
      newNodes[fileId] = {
        ...file,
        name: trimmedName,
        ext: trimmedExt,
      };

      const newState = {
        ...state,
        nodes: newNodes,
      };

      // Save to storage
      saveToStorage({ nodes: newState.nodes, rootId: newState.rootId });

      return {
        ...newState,
        toasts: [
          ...state.toasts,
          createToast(
            `File renamed to "${trimmedName}.${trimmedExt}" successfully`,
            "success"
          ),
        ],
      };
    }

    case "RENAME_FOLDER": {
      const { folderId, newName } = action.payload;

      // Validate
      const validationError = validateFolderRename(state, folderId, newName);
      if (validationError) {
        return {
          ...state,
          toasts: [
            ...state.toasts,
            createToast(validationError.message, "error"),
          ],
        };
      }

      const folder = state.nodes[folderId];
      if (!folder || folder.type !== "folder") {
        return {
          ...state,
          toasts: [...state.toasts, createToast("Folder not found", "error")],
        };
      }

      // Prevent renaming root
      if (folderId === state.rootId) {
        return {
          ...state,
          toasts: [
            ...state.toasts,
            createToast("Cannot rename root folder", "error"),
          ],
        };
      }

      const trimmedName = newName.trim();

      const newNodes = { ...state.nodes };
      newNodes[folderId] = {
        ...folder,
        name: trimmedName,
      };

      const newState = {
        ...state,
        nodes: newNodes,
      };

      // Save to storage
      saveToStorage({ nodes: newState.nodes, rootId: newState.rootId });

      return {
        ...newState,
        toasts: [
          ...state.toasts,
          createToast(`Folder renamed to "${trimmedName}" successfully`, "success"),
        ],
      };
    }

    case "DELETE_NODE": {
      const { nodeId } = action.payload;

      // Prevent deleting root
      if (nodeId === state.rootId) {
        return {
          ...state,
          toasts: [
            ...state.toasts,
            createToast("Cannot delete root folder", "error"),
          ],
        };
      }

      const node = state.nodes[nodeId];
      if (!node) {
        return {
          ...state,
          toasts: [...state.toasts, createToast("Node not found", "error")],
        };
      }

      const updatedState = deleteNodeRecursive(state, nodeId);

      // Save to storage
      saveToStorage({ nodes: updatedState.nodes, rootId: updatedState.rootId });

      const nodeDescription =
        node.type === "file"
          ? `"${node.name}.${(node as any).ext}"`
          : `folder "${node.name}"`;

      return {
        ...updatedState,
        toasts: [
          ...state.toasts,
          createToast(`${nodeDescription} deleted successfully`, "success"),
        ],
      };
    }

    case "ADD_TOAST": {
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    }

    case "REMOVE_TOAST": {
      return {
        ...state,
        toasts: state.toasts.filter(
          (toast) => toast.id !== action.payload.toastId
        ),
      };
    }

    default:
      return state;
  }
};
