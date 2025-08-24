import {
  type FormEvent,
  type FC,
  type MouseEvent,
  useState,
  useEffect,
} from "react";
import { useFS } from "../state/fsContext";

interface DialogRenameFileProps {
  fileId: string;
  onClose: () => void;
}

export const DialogRenameFile: FC<DialogRenameFileProps> = ({
  fileId,
  onClose,
}) => {
  const { state, dispatch } = useFS();
  const [name, setName] = useState("");
  const [ext, setExt] = useState("");

  const file = state.nodes[fileId];

  useEffect(() => {
    if (file && file.type === "file") {
      setName(file.name);
      setExt(file.ext);
    }
  }, [file]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "RENAME_FILE",
      payload: { fileId, newName: name, newExt: ext },
    });
    onClose();
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!file || file.type !== "file") {
    return null;
  }

  return (
    <div className="dialog-backdrop" onClick={handleBackdropClick}>
      <div className="dialog">
        <div className="dialog-header">
          <h3>Rename File</h3>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fileName">File Name:</label>
            <input
              id="fileName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter file name"
              autoFocus
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="fileExt">Extension:</label>
            <input
              id="fileExt"
              type="text"
              value={ext}
              onChange={(e) => setExt(e.target.value)}
              placeholder="e.g. txt, js, md"
              required
            />
          </div>
          <div className="dialog-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Rename File
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
