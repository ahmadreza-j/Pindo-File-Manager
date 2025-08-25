import { type FormEvent, type FC, type MouseEvent, useState } from "react";
import { useFS } from "../state/fsContext";
import { validateFileCreation } from "../state/validators";

interface DialogCreateFileProps {
  parentId: string;
  onClose: () => void;
}

const parseFilename = (fullFilename: string): { name: string; ext: string } => {
  const trimmed = fullFilename.trim();
  const lastDotIndex = trimmed.lastIndexOf('.');
  
  if (lastDotIndex === -1 || lastDotIndex === 0 || lastDotIndex === trimmed.length - 1) {
    // No extension found, filename starts with dot, or filename ends with dot
    return { name: trimmed, ext: "" };
  }
  
  const name = trimmed.substring(0, lastDotIndex);
  const ext = trimmed.substring(lastDotIndex + 1);
  
  return { name, ext };
};

export const DialogCreateFile: FC<DialogCreateFileProps> = ({
  parentId,
  onClose,
}) => {
  const { state, dispatch } = useFS();
  const [filename, setFilename] = useState("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { name, ext } = parseFilename(filename);
    
    // Validate before dispatching
    const validationError = validateFileCreation(state, parentId, name, ext);
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
      type: "ADD_FILE",
      payload: { parentId, name, ext },
    });
    onClose();
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="dialog-backdrop" onClick={handleBackdropClick}>
      <div className="dialog">
        <div className="dialog-header">
          <h3>Create New File</h3>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fileName">File Name (with extension):</label>
            <input
              id="fileName"
              type="text"
              value={filename}
              onChange={(e) => {
                setFilename(e.target.value);
                // Clear error when user types
                if (error) setError("");
              }}
              placeholder="e.g. document.txt, script.js, README.md"
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
              Create File
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
