import {
  type FormEvent,
  type FC,
  type MouseEvent,
  useState,
  useEffect,
} from "react";
import { useFS } from "../state/fsContext";
import { validateFolderRename } from "../state/validators";

interface DialogRenameFolderProps {
  folderId: string;
  onClose: () => void;
}

export const DialogRenameFolder: FC<DialogRenameFolderProps> = ({
  folderId,
  onClose,
}) => {
  const { state, dispatch } = useFS();
  const [name, setName] = useState("");
  const [error, setError] = useState<string>("");

  const folder = state.nodes[folderId];

  useEffect(() => {
    if (folder && folder.type === "folder") {
      setName(folder.name);
    }
  }, [folder]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate before dispatching
    const validationError = validateFolderRename(state, folderId, name);
    if (validationError) {
      setError(validationError.message);
      // Also dispatch toast for consistency
      dispatch({
        type: "ADD_TOAST",
        payload: {
          id: crypto.randomUUID(),
          message: validationError.message,
          type: "error"
        }
      });
      return; // Keep dialog open
    }

    // Clear error and proceed
    setError("");
    dispatch({
      type: "RENAME_FOLDER",
      payload: { folderId, newName: name },
    });
    onClose();
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!folder || folder.type !== "folder") {
    return null;
  }

  return (
    <div className="dialog-backdrop" onClick={handleBackdropClick}>
      <div className="dialog">
        <div className="dialog-header">
          <h3>Rename Folder</h3>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="folderName">Folder Name:</label>
            <input
              id="folderName"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                // Clear error when user types
                if (error) setError("");
              }}
              placeholder="Enter folder name"
              autoFocus
              required
            />
            {error && <div className="error-message">{error}</div>}
          </div>
          <div className="dialog-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Rename Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};