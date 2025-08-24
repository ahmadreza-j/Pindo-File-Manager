import { useFS } from "../state/fsContext";

interface ConfirmDeleteDialogProps {
  nodeId: string;
  onClose: () => void;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  nodeId,
  onClose,
}) => {
  const { state, dispatch } = useFS();
  const node = state.nodes[nodeId];

  const handleConfirm = () => {
    dispatch({
      type: "DELETE_NODE",
      payload: { nodeId },
    });
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!node) {
    return null;
  }

  const getNodeDescription = () => {
    if (node.type === "file") {
      return `file "${node.name}.${node.ext}"`;
    } else {
      return `folder "${node.name}" and all of its contents`;
    }
  };

  return (
    <div className="dialog-backdrop" onClick={handleBackdropClick}>
      <div className="dialog">
        <div className="dialog-header">
          <h3>Confirm Delete</h3>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>
        <div className="dialog-content">
          <p>Are you sure you want to delete this {getNodeDescription()}?</p>
          {node.type === "folder" && (
            <p className="warning">This action cannot be undone.</p>
          )}
        </div>
        <div className="dialog-actions">
          <button type="button" onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button onClick={handleConfirm} className="btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
