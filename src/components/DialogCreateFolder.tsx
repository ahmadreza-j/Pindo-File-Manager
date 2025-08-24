import React, { useState } from 'react';
import { useFS } from '../state/fsContext';

interface DialogCreateFolderProps {
  parentId: string;
  onClose: () => void;
}

export const DialogCreateFolder: React.FC<DialogCreateFolderProps> = ({
  parentId,
  onClose
}) => {
  const { dispatch } = useFS();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_FOLDER',
      payload: { parentId, name }
    });
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="dialog-backdrop" onClick={handleBackdropClick}>
      <div className="dialog">
        <div className="dialog-header">
          <h3>Create New Folder</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="folderName">Folder Name:</label>
            <input
              id="folderName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name"
              autoFocus
              required
            />
          </div>
          <div className="dialog-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};